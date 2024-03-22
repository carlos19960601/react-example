
const { Server } = require('socket.io');
const http = require('http');
const express = require('express');
const path = require('path');
const Logs = require('./logs');
const log = new Logs('server');
const checkXSS = require('./xss.js');

// Room presenters
const roomPresentersString = process.env.PRESENTERS || '["MiroTalk P2P"]';
const roomPresenters = JSON.parse(roomPresentersString);

require('dotenv').config();

const port = process.env.PORT || 3000; 


const channels = {}; // collect channels
const sockets = {}; // collect sockets
const peers = {}; // collect peers info grp by channels
const presenters = {}; // collect presenters grp by channels

// Stun (https://bloggeek.me/webrtcglossary/stun/)
// Turn (https://bloggeek.me/webrtcglossary/turn/)
const iceServers = [];
const stunServerUrl = process.env.STUN_SERVER_URL;
const turnServerUrl = process.env.TURN_SERVER_URL;
const turnServerUsername = process.env.TURN_SERVER_USERNAME;
const turnServerCredential = process.env.TURN_SERVER_CREDENTIAL;
const stunServerEnabled = getEnvBoolean(process.env.STUN_SERVER_ENABLED);
const turnServerEnabled = getEnvBoolean(process.env.TURN_SERVER_ENABLED);
// Stun is mandatory for not internal network
if (stunServerEnabled && stunServerUrl) iceServers.push({ urls: stunServerUrl });
// Turn is recommended if direct peer to peer connection is not possible
if (turnServerEnabled && turnServerUrl && turnServerUsername && turnServerCredential) {
    iceServers.push({ urls: turnServerUrl, username: turnServerUsername, credential: turnServerCredential });
}

// html views
const views = {
    landing: path.join(__dirname, '../../', 'public/views/landing.html'),
    client: path.join(__dirname, '../../', 'public/views/client.html'),
}

let io, server, authHost;

const app = express();
const isHttps = process.env.HTTPS == 'true';
if (isHttps) {

} else {
    server = http.createServer(app)
}

io = new Server({
    maxHttpBufferSize: 1e7,
    transports: ["websocket"],
}).listen(server);



// directory
const dir = {
    public: path.join(__dirname, '../../', 'public'),
    client: path.join(__dirname, '../../', 'public/views/client.html'),
};

app.use(express.static(dir.public)); // Use all static files from the public folder
app.use((req, res, next)=> {
    next();
}) 


app.get(["/"], (req, res) => {
    res.sendFile(views.landing);
})

app.get("/join/:roomId", (req, res) => {
    res.sendFile(views.client);
})

// stats configuration
const statsData = {
    enabled: process.env.STATS_ENABLED ? getEnvBoolean(process.env.STATS_ENABLED) : true,
    src: process.env.STATS_SCR || 'https://stats.mirotalk.com/script.js',
    id: process.env.STATS_ID || 'c7615aa7-ceec-464a-baba-54cb605d7261',
};

// Get stats endpoint
app.get(['/stats'], (req, res) => {
    res.send(statsData);
});


/**
 * On peer connected
 * Users will connect to the signaling server, after which they'll issue a "join"
 * to join a particular channel. The signaling server keeps track of all sockets
 * who are in a channel, and on join will send out 'addPeer' events to each pair
 * of users in a channel. When clients receive the 'addPeer' even they'll begin
 * setting up an RTCPeerConnection with one another. During this process they'll
 * need to relay ICECandidate information to one another, as well as SessionDescription
 * information. After all of that happens, they'll finally be able to complete
 * the peer connection and will be in streaming audio/video between eachother.
 */

io.sockets.on('connection', async (socket) => {
    log.debug('[' + socket.id + '] connection accepted', {
        host: socket.handshake.headers.host.split(':')[0],
        time: socket.handshake.time,
    });

    socket.channels = {};
    sockets[socket.id] = socket;


    const transport = socket.conn.transport.name; // in most cases, "polling"
    log.debug('[' + socket.id + '] Connection transport', transport);

    /**
    * Check upgrade transport
    */
    socket.conn.on('upgrade', () => {
        const upgradedTransport = socket.conn.transport.name; // in most cases, "websocket"
        log.debug('[' + socket.id + '] Connection upgraded transport', upgradedTransport);
    });

    /**
     * On peer diconnected
     */
    socket.on('disconnect', async (reason) => {
        for (let channel in socket.channels) {
            await removePeerFrom(channel);
            removeIP(socket);
        }
        log.debug('[' + socket.id + '] disconnected', { reason: reason });
        delete sockets[socket.id];
    });

    /**
     * Handle incoming data, res with a callback
     */
    socket.on('data', async (dataObj, cb) => {
        const data = checkXSS(dataObj);

        log.debug('Socket Promise', data);

        cb(false);
    })

     /**
     * On peer join
     */
     socket.on('join', async (cfg) => {
         // Get peer IPv4 (::1 Its the loopback address in ipv6, equal to 127.0.0.1 in ipv4)
         const peer_ip = socket.handshake.headers['x-forwarded-for'] || socket.conn.remoteAddress;

         // Prevent XSS injection
        const config = checkXSS(cfg);

        // log.debug('Join room', config);
        log.debug('[' + socket.id + '] join ', config);

        const {
            channel,
            channel_password,
            peer_uuid,
            peer_name,
            peer_username,
            peer_password,
            peer_video,
            peer_audio,
            peer_video_status,
            peer_audio_status,
            peer_screen_status,
            peer_hand_status,
            peer_rec_status,
            peer_privacy_status,
        } = config;

        if (channel in socket.channels) {
            return log.debug('[' + socket.id + '] [Warning] already joined', channel);
        }

        // no channel aka room in channels init
        if (!(channel in channels)) channels[channel] = {};

        // no channel aka room in peers init
        if (!(channel in peers)) peers[channel] = {};

        // no presenter aka host in presenters init
        if (!(channel in presenters)) presenters[channel] = {};

        // Set the presenters
        const presenter = {
            peer_ip: peer_ip,
            peer_name: peer_name,
            peer_uuid: peer_uuid,
            is_presenter: true,
        };
         // first we check if the username match the presenters username
        if (roomPresenters && roomPresenters.includes(peer_name)) {
            presenters[channel][socket.id] = presenter;
        } else {
            // if not match the presenters username, the first one join room is the presenter
            if (Object.keys(presenters[channel]).length == 0) {
                presenters[channel][socket.id] = presenter
            }
        }

        // Check if peer is presenter
        const isPresenter = await isPeerPresenter(channel, socket.id, peer_name, peer_uuid);

        // collect peers info grp by channels
        peers[channel][socket.id] = {
            peer_name: peer_name,
            peer_presenter: isPresenter,
            peer_video: peer_video,
            peer_audio: peer_audio,
            peer_video_status: peer_video_status,
            peer_audio_status: peer_audio_status,
            peer_screen_status: peer_screen_status,
            peer_hand_status: peer_hand_status,
            peer_rec_status: peer_rec_status,
            peer_privacy_status: peer_privacy_status,
        };

        await addPeerTo(channel);

        channels[channel][socket.id] = socket;
        socket.channels[channel] = channel;

        const peerCounts = Object.keys(peers[channel]).length;
        await sendToPeer(socket.id, sockets, "serverInfo", {
            peers_count: peerCounts,
            is_presenter: isPresenter,
        });
     })

     /**
     * Relay SDP to peers
     */
    socket.on('relaySDP', async (config) => {
        const { peer_id, session_description } = config;

        log.debug('[' + socket.id + '] relay SessionDescription to [' + peer_id + '] ', {
            type: session_description.type,
        });

        await sendToPeer(peer_id, sockets, 'sessionDescription', {
            peer_id: socket.id,
            session_description: session_description,
        });
    })

     /**
     * Relay ICE to peers
     */
    socket.on('relayICE', async (config) => {
        const { peer_id, ice_candidate } = config;

        log.debug('[' + socket.id + '] relay ICE-candidate to [' + peer_id + '] ', {
            address: config.ice_candidate,
        });

        await sendToPeer(peer_id, sockets, 'iceCandidate', {
            peer_id: socket.id,
            ice_candidate: ice_candidate,
        });
    });

     /**
     * Add peers to channel
     * @param {string} channel room id
     */
     async function addPeerTo(channel) {
        // 如果第一个进来，是不会进入这个for循环
        for (let id in channels[channel]) {
            // 已经在channel里面的人不需要主动打招呼(create offer)
            // offer false
            await channels[channel][id].emit('addPeer', {
                peer_id: socket.id,
                peers: peers[channel],
                should_create_offer: false,
                iceServers: iceServers,
            });

            // 后面进来的人需要想channel里面的其他人打招呼(create offer)
            // offer true
            socket.emit('addPeer', {
                peer_id: id,
                peers: peers[channel],
                should_create_offer: true,
                iceServers: iceServers,
            });
            log.debug('[' + socket.id + '] emit addPeer [' + id + ']');
        }
     }

    /**
     * Remove peers from channel
     * @param {string} channel room id
     */
    async function removePeerFrom(channel) {
        if (!(channel in socket.channels)) {
            return log.debug('[' + socket.id + '] [Warning] not in ', channel);
        }

        try {
            delete socket.channels[channel];
            delete channels[channel][socket.id];
            delete peers[channel][socket.id]; // delete peer data from the room

            switch (Object.keys(peers[channel]).length) {
                case 0: // last peer disconnected from the room without room lock & password set
                    delete peers[channel];
                    delete presenters[channel];
                    break;
                case 2: // last peer disconnected from the room having room lock & password set
                    if (peers[channel]['lock'] && peers[channel]['password']) {
                        delete peers[channel]; // clean lock and password value from the room
                        delete presenters[channel]; // clean the presenter from the channel
                    }
                    break;
            }
        } catch (err) {
            log.error('Remove Peer', toJson(err));
        }
    }

    /**
     * Send async data to specified peer
     * @param {string} peer_id id of the peer to send data
     * @param {object} sockets all peers connections
     * @param {string} msg message to send to the peer in the same room
     * @param {object} config data to send to the peer in the same room
     */
     async function sendToPeer(peer_id, sockets, msg, config= {}) {
        if (peer_id in sockets) {
            await sockets[peer_id].emit(msg, config);
            //console.log('Send to peer', { msg: msg, config: config });
        }
     }


})


server.listen(port, null, ()=> {

})



/**
 * Get Env as boolean
 * @param {string} key
 * @param {boolean} force_true_if_undefined
 * @returns boolean
 */
function getEnvBoolean(key, force_true_if_undefined = false) {
    if (key == undefined && force_true_if_undefined) return true;
    return key == 'true' ? true : false;
}

/**
 * Check if peer is Presenter
 * @param {string} room_id
 * @param {string} peer_id
 * @param {string} peer_name
 * @param {string} peer_uuid
 * @returns boolean
 */
async function isPeerPresenter(room_id, peer_id, peer_name, peer_uuid) {
    try {
        if (!presenters[room_id] || !presenters[room_id][peer_id] ) {
            return false
        }

        const isPresenter = (typeof presenters[room_id] === "object" && 
        Object.keys(presenters[room_id][peer_id].length > 1 &&
            presenters[room_id][peer_id]["peer_name"] === peer_name &&
            presenters[room_id][peer_id]["peer_uuid"] === peer_uuid )) || 
            (roomPresenters && roomPresenters.includes(peer_name));
        log.debug('[' + peer_id + '] isPeerPresenter', presenters[room_id][peer_id]);
        return isPresenter;
    } catch (err) {
        log.error('isPeerPresenter', err);
        return false;
    }
}

/**
 * Remove hosts auth ip on socket disconnect
 * @param {object} socket
 */
function removeIP(socket) {
    // if (hostCfg.protected) {
    //     const ip = socket.handshake.address;
    //     log.debug('Host protected check ip', { ip: ip });
    //     if (ip && allowedIP(ip)) {
    //         authHost.deleteIP(ip);
    //         hostCfg.authenticated = false;
    //         log.debug('Remove IP from auth', { ip: ip });
    //     }
    // }
}