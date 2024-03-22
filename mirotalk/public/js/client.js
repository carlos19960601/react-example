// Peer infos
const userAgent = navigator.userAgent.toLowerCase();
const detectRtcVersion = DetectRTC.version;
const isWebRTCSupported = DetectRTC.isWebRTCSupported;
const isMobileDevice = DetectRTC.isMobileDevice;
const isTabletDevice = isTablet(userAgent);
const isIPadDevice = isIpad(userAgent);
const isDesktopDevice = !isMobileDevice && !isTabletDevice && !isIPadDevice;
const osName = DetectRTC.osName;
const osVersion = DetectRTC.osVersion;
const browserName = DetectRTC.browser.name;
const browserVersion = DetectRTC.browser.version;
const peerInfo = getPeerInfo();

// video
let myVideo;
let myAudio;
let myVideoParagraph;
let isVideoFullScreenSupported = true;
let isHideMeActive = getHideMeActive();
let isVideoPrivacyActive = false; // Video circle for privacy

// My settings
const mySettings = getId('mySettings');
const mySettingsHeader = getId('mySettingsHeader');
const tabVideoBtn = getId('tabVideoBtn');
const tabAudioBtn = getId('tabAudioBtn');
const tabVideoShareBtn = getId('tabVideoShareBtn');
const tabRecordingBtn = getId('tabRecordingBtn');
const tabParticipantsBtn = getId('tabParticipantsBtn');
const tabProfileBtn = getId('tabProfileBtn');
const tabRoomBtn = getId('tabRoomBtn');
const roomSendEmailBtn = getId('roomSendEmailBtn');
const tabStylingBtn = getId('tabStylingBtn');
const tabLanguagesBtn = getId('tabLanguagesBtn');
const mySettingsCloseBtn = getId('mySettingsCloseBtn');
const myPeerNameSet = getId('myPeerNameSet');
const myPeerNameSetBtn = getId('myPeerNameSetBtn');
const switchSounds = getId('switchSounds');
const switchShare = getId('switchShare');
const switchPushToTalk = getId('switchPushToTalk');
const switchAudioPitchBar = getId('switchAudioPitchBar');
const audioInputSelect = getId('audioSource');
const audioOutputSelect = getId('audioOutput');
const audioOutputDiv = getId('audioOutputDiv');
const speakerTestBtn = getId('speakerTestBtn');
const videoSelect = getId('videoSource');
const videoQualitySelect = getId('videoQuality');
const videoFpsSelect = getId('videoFps');
const videoFpsDiv = getId('videoFpsDiv');
const screenFpsSelect = getId('screenFps');
const pushToTalkDiv = getId('pushToTalkDiv');
const recImage = getId('recImage');
const switchH264Recording = getId('switchH264Recording');
const pauseRecBtn = getId('pauseRecBtn');
const resumeRecBtn = getId('resumeRecBtn');
const recordingTime = getId('recordingTime');
const lastRecordingInfo = getId('lastRecordingInfo');
const themeSelect = getId('mirotalkTheme');
const videoObjFitSelect = getId('videoObjFitSelect');
const mainButtonsBar = getQsA('#buttonsBar button');
const mainButtonsIcon = getQsA('#buttonsBar button i');
const btnsBarSelect = getId('mainButtonsBarPosition');
const pinUnpinGridDiv = getId('pinUnpinGridDiv');
const pinVideoPositionSelect = getId('pinVideoPositionSelect');
const tabRoomPeerName = getId('tabRoomPeerName');
const tabRoomParticipants = getId('tabRoomParticipants');
const tabRoomSecurity = getId('tabRoomSecurity');
const isPeerPresenter = getId('isPeerPresenter');
const peersCount = getId('peersCount');
const screenFpsDiv = getId('screenFpsDiv');

// Video/Audio media container
const videoMediaContainer = getId('videoMediaContainer');
const videoPinMediaContainer = getId('videoPinMediaContainer');
const audioMediaContainer = getId('audioMediaContainer');


// connection
let signalingSocket; 
let peerConnections = {}; // keep track of our peer connections, indexed by peer_id == socket.io id
let allPeers = {}; // keep track of all peers in the room, indexed by peer_id == socket.io id


// media
let useAudio = true; // User allow for microphone usage
let useVideo = true; // User allow for camera usage
let isEnumerateVideoDevices = false;
let isEnumerateAudioDevices = false;


// stream
let initStream; // initial webcam stream
let localVideoMediaStream; // my webcam
let localAudioMediaStream; // my microphone

// Init audio-video
const initVideoSelect = getId('initVideoSelect');

// peer
let myPeerId; // This socket.id
let myPeerUUID = getUUID(); // Unique peer id
let myPeerName = getPeerName();
let myUsername = getPeerUsername(); // default false if not passed by query params
let myPassword = getPeerPassword(); // default false if not passed by query params
let isPresenter = false; // True Who init the room (aka first peer joined)
let myVideoStatus = false;
let myAudioStatus = false;
let myScreenStatus = false;
let myHandStatus = false;

// settings
let videoMaxFrameRate = 30;
let screenMaxFrameRate = 30;
let thisRoomPassword = null;

// recording
let isStreamRecording = false;

// misc
let swBg = 'rgba(0, 0, 0, 0.7)'; 

// This room
const myRoomId = getId('myRoomId');
const roomId = getRoomId();

const isRulesActive = true; // Presenter can do anything, guest is slightly moderate, if false no Rules for the room.


const forceCamMaxResolutionAndFps = false; // This force the webCam to max resolution as default, up to 4k and 60fps (very high bandwidth are required) if false, you can set it from settings


// Local Storage class
const lS = new LocalStorage();

/**
 * On body load Get started
 */
function initClientPeer() {
    // check if video Full screen supported on default true
    if (peerInfo.isMobileDevice && peerInfo.osName === 'iOS') {
        isVideoFullScreenSupported = false;
    }
    console.log('01. Connecting to signaling server');

    // Disable the HTTP long-polling transport
    // url defaults to window.location.host
    signalingSocket = io({ transports: ['websocket'] });

    const transport = signalingSocket.io.engine.transport.name; // in most cases, "polling"
    console.log('02. Connection transport', transport);

    // Check upgrade transport
    signalingSocket.io.engine.on('upgrade', () => {
        const upgradedTransport = signalingSocket.io.engine.transport.name; // in most cases, "websocket"
        console.log('Connection upgraded transport', upgradedTransport);
    });

    // async - await requests
    signalingSocket.request = function request(type, data = {}) {
        return new Promise((resolve, reject) => {
            signalingSocket.emit(type, data, (data) => {
                if (data.error) {
                    console.error('signalingSocket.request error', data.error);
                    reject(data.error);
                } else {
                    console.log('signalingSocket.request data', data);
                    resolve(data);
                }
            });
        });
    };

    // on receiving data from signaling server...
    signalingSocket.on('connect', handleConnect);
    signalingSocket.on('disconnect', handleDisconnect);
    signalingSocket.on('serverInfo', handleServerInfo);
    signalingSocket.on('addPeer', handleAddPeer);
    signalingSocket.on('sessionDescription', handleSessionDescription);
    signalingSocket.on('iceCandidate', handleIceCandidate);
}


/**
 * The offerer will send a number of ICE Candidate blobs to the answerer so they
 * can begin trying to find the best path to one another on the net.
 * @param {object} config data
 */
function handleIceCandidate(config) {
    const { peer_id, ice_candidate } = config;
    // https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate
    peerConnections[peer_id].addIceCandidate(new RTCIceCandidate(ice_candidate)).catch((err) => {
        console.error('[Error] addIceCandidate', err);
    });
}

/**
 * Peers exchange session descriptions which contains information about their audio / video settings and that sort of stuff. First
 * the 'offerer' sends a description to the 'answerer' (with type "offer"), then the answerer sends one back (with type "answer").
 * @param {object} config data
 */
function handleSessionDescription(config) {
    console.log('Remote Session Description', config);
    const { peer_id, session_description } = config;

    // https://developer.mozilla.org/en-US/docs/Web/API/RTCSessionDescription
    const remote_description = new RTCSessionDescription(session_description);

    // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/setRemoteDescription
    peerConnections[peer_id]
    .setRemoteDescription(remote_description)
    .then(()=> {
        console.log('setRemoteDescription done!');
        if (session_description.type == 'offer') {
            console.log('Creating answer');
             // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createAnswer
             peerConnections[peer_id]
             .createAnswer()
             .then((local_description)=> {
                console.log('Answer description is: ', local_description);
                // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/setLocalDescription
                peerConnections[peer_id]
                .setLocalDescription(local_description)
                .then(()=>{
                    sendToServer('relaySDP', {
                        peer_id: peer_id,
                        session_description: local_description,
                    });
                    console.log('Answer setLocalDescription done!');
                }).catch((err) => {
                    console.error('[Error] answer setLocalDescription', err);
                });
             }).catch((err) => {
                console.error('[Error] creating answer', err);
            });
        }
    }).catch((err)=> {
        console.error('[Error] setRemoteDescription', err);
    })
}

/**
 * When we join a group, our signaling server will send out 'addPeer' events to each pair of users in the group (creating a fully-connected graph of users,
 * ie if there are 6 people in the channel you will connect directly to the other 5, so there will be a total of 15 connections in the network).
 * @param {object} config data
 */
async function handleAddPeer(config) {
    const { peer_id, should_create_offer, iceServers, peers } = config;

    const peer_name = peers[peer_id]['peer_name'];
    const peer_video = peers[peer_id]['peer_video'];

    if (peer_id in peerConnections) {
        // This could happen if the user joins multiple channels where the other peer is also in.
        return console.log('Already connected to peer', peer_id);
    }

    console.log('iceServers', iceServers[0]);

    const peerConnection = new RTCPeerConnection({iceServers: iceServers})
    peerConnections[peer_id] = peerConnection

    allPeers = peers;

    console.log('[RTCPeerConnection] - PEER_ID', peer_id); // the connected peer_id
    console.log('[RTCPeerConnection] - PEER-CONNECTIONS', peerConnections); // all peers connections in the room expect myself
    console.log('[RTCPeerConnection] - PEERS', peers); // all peers in the room

    // As P2P check who I am connected with
    let connectedPeersName = [];
    for (const id in peerConnections) {
        connectedPeersName.push(peers[id]['peer_name']);
    }

    console.log('[RTCPeerConnection] - CONNECTED TO PEERS', JSON.stringify(connectedPeersName));

    await handleOnIceCandidate(peer_id);
    await handleOnTrack(peer_id, peers);
    await handleAddTracks(peer_id);

    if (should_create_offer) {
        await handleRtcOffer(peer_id);
        console.log('[RTCPeerConnection] - SHOULD CREATE OFFER', {
            peer_id: peer_id,
            peer_name: peer_name,
        });
    }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onicecandidate
 * @param {string} peer_id socket.id
 */
// 与SDP信息交换是独立的
async function handleOnIceCandidate(peer_id) {
    peerConnections[peer_id].onicecandidate = (event) => {
        if (!event.candidate) return;

        sendToServer('relayICE', {
            peer_id: peer_id,
            ice_candidate: {
                sdpMLineIndex: event.candidate.sdpMLineIndex,
                candidate: event.candidate.candidate,
            },
        });
    }   
}

/**
 * Only one side of the peer connection should create the offer, the signaling server picks one to be the offerer.
 * The other user will get a 'sessionDescription' event and will create an offer, then send back an answer 'sessionDescription' to us
 * @param {string} peer_id socket.id
 */
async function handleRtcOffer(peer_id) {
    // peerConnection.addTrack后才会触发onnegotiationneeded
    peerConnections[peer_id].onnegotiationneeded = () => {
        console.log('Creating RTC offer to ' + allPeers[peer_id]['peer_name']);

        peerConnections[peer_id].createOffer().then((local_description) => {
            console.log('Local offer description is', local_description);
            peerConnections[peer_id].setLocalDescription(local_description)
            .then(() => {
                sendToServer('relaySDP', {
                    peer_id: peer_id,
                    session_description: local_description,
                });
                console.log('Offer setLocalDescription done!'); 
            }).catch((err) => {
                console.error('[Error] offer setLocalDescription', err);
            })

        }).catch((err) => {
            console.error('[Error] sending offer', err);
        })
    }
}

async function handleConnect() {
    console.log('03. Connected to signaling server');

    myPeerId = signalingSocket.id;
    console.log('04. My peer id [ ' + myPeerId + ' ]');

    if (localVideoMediaStream && localAudioMediaStream) {
        await joinToChannel();
    } else {
        await initEnumerateDevices();
        await setupLocalVideoMedia();
        await setupLocalAudioMedia();
        getHtmlElementsById();
        await whoAreYou();
    }

}

/**
 * join to channel and send some peer info
 */
async function joinToChannel() {
    console.log('12. join to channel', roomId);
    sendToServer('join', {
        join_data_time: getDataTimeString(),
        channel: roomId,
        channel_password: thisRoomPassword,
        peer_info: peerInfo,
        peer_uuid: myPeerUUID,
        peer_name: myPeerName,
        peer_username: myUsername,
        peer_password: myPassword,
        peer_video: useVideo,
        peer_audio: useAudio,
        peer_video_status: myVideoStatus,
        peer_audio_status: myAudioStatus,
        peer_screen_status: myScreenStatus,
        peer_hand_status: myHandStatus,
        peer_rec_status: isStreamRecording,
        peer_privacy_status: isVideoPrivacyActive,
        userAgent: userAgent,
    });
}


/**
 * Disconnected from Signaling Server.
 * Tear down all of our peer connections and remove all the media divs.
 * @param {object} reason of disconnection
 */
function handleDisconnect(reason) {
    console.log('Disconnected from signaling server', { reason: reason });

}

/**
 * Handle some signaling server info
 * @param {object} config data
 */
function handleServerInfo(config) {
    console.log('13. Server info', config);

    const { peers_count, host_protected, user_auth, is_presenter, survey, redirect, rec_prioritize_h264 } = config;
}

/**
 * Setup local video media. Ask the user for permission to use the computer's camera,
 * and attach it to a <video> tag if access is granted.
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
 */
async function setupLocalVideoMedia() {
    if (!useVideo || localVideoMediaStream) {
        return;
    }

    console.log('Requesting access to local video inputs');

    const videoConstraints = useVideo ? await getVideoConstraints('default') : false;

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints });
        if (stream) {
            localVideoMediaStream = stream;
            await loadLocalMedia(stream, 'video');
            console.log('10. Access granted to video device');
        }
    } catch (err) {
        handleMediaError('video', err);
    }
}

/**
 * Setup local audio media. Ask the user for permission to use the computer's microphone,
 * and attach it to an <audio> tag if access is granted.
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
 */
async function setupLocalAudioMedia() {
    if (!useAudio || localAudioMediaStream) {
        return;
    }

    console.log('Requesting access to local audio inputs');

    const audioConstraints = useAudio ? await getAudioConstraints() : false;

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints });
        if (stream) {
            await loadLocalMedia(stream, 'audio');
            if (useAudio) {
                localAudioMediaStream = stream;
                // await getMicrophoneVolumeIndicator(stream);
                console.log('10. Access granted to audio device');
            }
        }
    } catch (err) {
        handleMediaError('audio', err);
    }
}

/**
 * Load Local Media Stream obj
 * @param {object} stream media stream audio - video
 */
async function loadLocalMedia(stream, kind) {
    if (stream) console.log('LOAD LOCAL MEDIA STREAM TRACKS', stream.getTracks());

    switch (kind) {
        case 'video':
            console.log('SETUP LOCAL VIDEO STREAM');

            // local video elements
            const myVideoWrap = document.createElement('div');
            const myLocalMedia = document.createElement('video');

            // html elements
            const myPeerName = document.createElement('p');

            // my peer name
            myPeerName.setAttribute('id', 'myVideoParagraph');
            myPeerName.className = 'videoPeerName notranslate';

            myLocalMedia.setAttribute('id', 'myVideo');
            myLocalMedia.setAttribute('playsinline', true);
            myLocalMedia.className = 'mirror';
            myLocalMedia.autoplay = true;
            myLocalMedia.muted = true;
            myLocalMedia.volume = 0;
            myLocalMedia.controls = false;

            myVideoWrap.className = 'Camera';
            myVideoWrap.setAttribute('id', 'myVideoWrap');

             // add elements to video wrap div
            myVideoWrap.appendChild(myLocalMedia);
            myVideoWrap.appendChild(myPeerName);

            videoMediaContainer.appendChild(myVideoWrap);
            elemDisplay(myVideoWrap, false);

            attachMediaStream(myLocalMedia, stream);
            break;
        case 'audio':
            console.log('SETUP LOCAL AUDIO STREAM');

            // handle remote audio elements
            const localAudioWrap = document.createElement('div');
            const localAudioMedia = document.createElement('audio');

            localAudioMedia.id = 'myAudio';
            localAudioMedia.controls = false;
            localAudioMedia.autoplay = true;
            localAudioMedia.muted = true;
            localAudioMedia.volume = 0;

            localAudioWrap.appendChild(localAudioMedia);
            
            audioMediaContainer.appendChild(localAudioWrap);

            attachMediaStream(localAudioMedia, stream);
            break;
        default:
            break;
        }
}

/**
 * AttachMediaStream stream to element
 * @param {object} element element to attach the stream
 * @param {object} stream media stream audio - video
 */
function attachMediaStream(element, stream) {
    if (!element || !stream) return;
    //console.log("DEPRECATED, attachMediaStream will soon be removed.");
    element.srcObject = stream;
    console.log('Success, media stream attached', stream.getTracks());
}


/**
 * set your name for the conference
 */
async function whoAreYou() {
    console.log('11. Who are you?');
    elemDisplay(loadingDiv, false);
    document.body.style.background = 'var(--body-bg)';

    initUser.classList.toggle('hidden');

    await loadLocalStorage();

    initVideoContainerShow(myVideoStatus);

    Swal.fire({
        allowOutsideClick: false,
        allowEscapeKey: false,
        background: swBg,
        title: 'MiroTalk P2P',
        position: 'center',
        input: 'text',
        inputPlaceholder: 'Enter your name',
        inputAttributes: { maxlength: 32 },
        inputValue: window.localStorage.peer_name ? window.localStorage.peer_name : '',
        html: initUser, // inject html
        confirmButtonText: `Join meeting`,
        customClass: { popup: 'init-modal-size' },
        showClass: { popup: 'animate__animated animate__fadeInDown' },
        hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        inputValidator: async (value) => {
            if (!value) return 'Please enter your name';
            // Long name
            if (value.length > 30) return 'Name must be max 30 char';
            // prevent xss execution itself
            myPeerName = filterXSS(value);


            window.localStorage.peer_name = myPeerName;
            whoAreYouJoin();
        }
    });

    // select video - audio
    initVideoSelect.onchange = async () => {
        videoSelect.selectedIndex = initVideoSelect.selectedIndex;
        lS.setLocalStorageDevices(lS.MEDIA_TYPE.video, initVideoSelect.selectedIndex, initVideoSelect.value);
        await changeInitCamera(initVideoSelect.value);
        await handleLocalCameraMirror();
    };
    initMicrophoneSelect.onchange = async () => {
        audioInputSelect.selectedIndex = initMicrophoneSelect.selectedIndex;
        lS.setLocalStorageDevices(lS.MEDIA_TYPE.audio, initMicrophoneSelect.selectedIndex, initMicrophoneSelect.value);
        await changeLocalMicrophone(initMicrophoneSelect.value);
    };
    initSpeakerSelect.onchange = () => {
        audioOutputSelect.selectedIndex = initSpeakerSelect.selectedIndex;
        lS.setLocalStorageDevices(lS.MEDIA_TYPE.speaker, initSpeakerSelect.selectedIndex, initSpeakerSelect.value);
        changeAudioDestination();
    };

}

/**
 * Room and Peer name are ok Join Channel
 */
async function whoAreYouJoin() {
    myVideoParagraph.innerText = myPeerName + ' (me)';
    joinToChannel();
    handleHideMe(isHideMeActive);
}



/**
 * Handle hide myself from room view
 * @param {boolean} isHideMeActive
 */
function handleHideMe(isHideMeActive) {
    if (isHideMeActive) {
        elemDisplay(myVideoWrap, false);
    } else {
        elemDisplay(myVideoWrap, true, 'inline-block');
    }
}

/**
 * Init to enumerate the devices
 */
async function initEnumerateDevices() {
    console.log('05. init Enumerate Video and Audio Devices');
    await initEnumerateVideoDevices();
    await initEnumerateAudioDevices();
}

/**
 * Init to enumerate the audio devices
 * @returns boolean true/false
 */
async function initEnumerateAudioDevices() {
    if (isEnumerateAudioDevices) return;
    // allow the audio
    await navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(async (stream) => {
            await enumerateAudioDevices(stream);
            useAudio = true;
        })
        .catch(() => {
            useAudio = false;
        });
}

/**
 * Init to enumerate the vide devices
 * @returns boolean true/false
 */
async function initEnumerateVideoDevices() {
    if (isEnumerateVideoDevices) return;
    // allow the video
    await navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(async (stream) => {
            await enumerateVideoDevices(stream);
            useVideo = true;
        })
        .catch(() => {
            useVideo = false;
        });
}


/**
 * Enumerate Video
 * @param {object} stream
 */
async function enumerateVideoDevices(stream) {
    console.log('07. Get Video Devices');
    await navigator.mediaDevices
        .enumerateDevices()
        .then((devices) =>
            devices.forEach(async (device) => {
                let el,
                    eli = null;
                if ('videoinput' === device.kind) {
                    el = videoSelect;
                    eli = initVideoSelect;
                    lS.DEVICES_COUNT.video++;
                }
                if (!el) return;
                await addChild(device, [el, eli]);
            }),
        )
        .then(async () => {
            await stopTracks(stream);
            isEnumerateVideoDevices = true;
        });
}


/**
 * Enumerate Audio
 * @param {object} stream
 */
async function enumerateAudioDevices(stream) {
    console.log('06. Get Audio Devices');
    await navigator.mediaDevices
        .enumerateDevices()
        .then((devices) =>
            devices.forEach(async (device) => {
                let el,
                    eli = null;
                if ('audioinput' === device.kind) {
                    el = audioInputSelect;
                    eli = initMicrophoneSelect;
                    lS.DEVICES_COUNT.audio++;
                } else if ('audiooutput' === device.kind) {
                    el = audioOutputSelect;
                    eli = initSpeakerSelect;
                    lS.DEVICES_COUNT.speaker++;
                }
                if (!el) return;
                await addChild(device, [el, eli]);
            }),
        )
        .then(async () => {
            await stopTracks(stream);
            isEnumerateAudioDevices = true;
        });
}

/**
 * Get Html element by Id
 * @param {string} id of the element
 * @returns {object} element
 */
function getId(id) {
    return document.getElementById(id);
}

/**
 * Get ALL Html elements by selector
 * @param {string} selector of the element
 * @returns {object} element
 */
function getSlALL(selector) {
    return document.querySelectorAll(selector);
}

/**
 * Get Html element by class name
 * @param {string} className of the element
 * @returns {object} element
 */
function getEcN(className) {
    return document.getElementsByClassName(className);
}

/**
 * Check if Tablet device
 * @param {object} userAgent info
 * @return {boolean} true/false
 */
function isTablet(userAgent) {
    return /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
        userAgent,
    );
}


/**
 * Check if IPad device
 * @param {object} userAgent
 * @return {boolean} true/false
 */
function isIpad(userAgent) {
    return /macintosh/.test(userAgent) && 'ontouchend' in document;
}


/**
 * Get peer info using DetectRTC
 * https://github.com/muaz-khan/DetectRTC
 * @returns {object} peer info
 */
function getPeerInfo() {
    return {
        detectRTCversion: detectRtcVersion,
        isWebRTCSupported: isWebRTCSupported,
        isDesktopDevice: isDesktopDevice,
        isMobileDevice: isMobileDevice,
        isTabletDevice: isTabletDevice,
        isIPadDevice: isIPadDevice,
        osName: osName,
        osVersion: osVersion,
        browserName: browserName,
        browserVersion: browserVersion,
    };
}

/**
 * Hide myself from the meeting view
 * @returns {boolean} true/false
 */
function getHideMeActive() {
    let qs = new URLSearchParams(window.location.search);
    let hide = filterXSS(qs.get('hide'));
    let queryHideMe = false;
    if (hide) {
        hide = hide.toLowerCase();
        queryHideMe = hide === '1' || hide === 'true';
    }
    console.log('Direct join', { hide: queryHideMe });
    return queryHideMe;
}

/**
 * Set document style property
 * @param {string} key
 * @param {string} value
 * @returns {objects} element
 */
function setSP(key, value) {
    return document.documentElement.style.setProperty(key, value);
}

/**
 * Get all element descendants of node
 * @param {string} selectors
 * @returns all element descendants of node that match selectors.
 */
function getQsA(selectors) {
    return document.querySelectorAll(selectors);
}


/**
 * Stop tracks from stream
 * @param {object} stream
 */
async function stopTracks(stream) {
    stream.getTracks().forEach((track) => {
        track.stop();
    });
}


/**
 * Add child to element
 * @param {object} device
 * @param {object} els
 */
async function addChild(device, els) {
    const { kind, deviceId, label } = device;
    els.forEach((el) => {
        const option = document.createElement('option');
        option.value = deviceId;
        switch (kind) {
            case 'videoinput':
                option.innerText = `📹 ` + label || `📹 camera ${el.length + 1}`;
                break;
            case 'audioinput':
                option.innerText = `🎤 ` + label || `🎤 microphone ${el.length + 1}`;
                break;
            case 'audiooutput':
                option.innerText = `🔈 ` + label || `🔈 speaker ${el.length + 1}`;
                break;
            default:
                break;
        }
        el.appendChild(option);
    });
}


/**
 * Get video constraints: https://webrtc.github.io/samples/src/content/getusermedia/resolution/
 * WebCam resolution: https://webcamtests.com/resolution
 * @param {string} videoQuality desired video quality
 * @returns {object} video constraints
 */
async function getVideoConstraints(videoQuality) {
    const frameRate = videoMaxFrameRate;

    switch (videoQuality) {
        case 'default':
            if (forceCamMaxResolutionAndFps) {
                // This will make the browser use the maximum resolution available as default, `up to 4K and 60fps`.
                return {
                    width: { ideal: 3840 },
                    height: { ideal: 2160 },
                    frameRate: { ideal: 60 },
                }; // video cam constraints default
            }
            // This will make the browser use hdVideo and 30fps.
            return {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                frameRate: { ideal: 30 },
            }; // on default as hdVideo
        case 'qvgaVideo':
            return {
                width: { exact: 320 },
                height: { exact: 240 },
                frameRate: frameRate,
            }; // video cam constraints low bandwidth
        case 'vgaVideo':
            return {
                width: { exact: 640 },
                height: { exact: 480 },
                frameRate: frameRate,
            }; // video cam constraints medium bandwidth
        case 'hdVideo':
            return {
                width: { exact: 1280 },
                height: { exact: 720 },
                frameRate: frameRate,
            }; // video cam constraints high bandwidth
        case 'fhdVideo':
            return {
                width: { exact: 1920 },
                height: { exact: 1080 },
                frameRate: frameRate,
            }; // video cam constraints very high bandwidth
        case '2kVideo':
            return {
                width: { exact: 2560 },
                height: { exact: 1440 },
                frameRate: frameRate,
            }; // video cam constraints ultra high bandwidth
        case '4kVideo':
            return {
                width: { exact: 3840 },
                height: { exact: 2160 },
                frameRate: frameRate,
            }; // video cam constraints ultra high bandwidth
    }
}


/**
 * Get audio constraints
 */
async function getAudioConstraints() {
    let constraints = {
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
        },
        video: false,
    };
    if (isRulesActive && isPresenter) {
        constraints = {
            audio: {
                autoGainControl: switchAutoGainControl.checked,
                echoCancellation: switchNoiseSuppression.checked,
                noiseSuppression: switchEchoCancellation.checked,
                sampleRate: parseInt(sampleRateSelect.value),
                sampleSize: parseInt(sampleSizeSelect.value),
                channelCount: parseInt(channelCountSelect.value),
                latency: parseInt(micLatencyRange.value),
                volume: parseInt(micVolumeRange.value / 100),
            },
            video: false,
        };
    }
    return constraints;
}



/**
 * Handle media access error.
 * @param {string} mediaType - 'video' or 'audio'
 * @param {Error} err - The error object
 */
function handleMediaError(mediaType, err) {
    console.error(`[Error] - Access denied for ${mediaType} device`, err);
}

/**
 * Element style display
 * @param {object} elem
 * @param {boolean} yes true/false
 */
function elemDisplay(element, display, mode = 'inline') {
    element.style.display = display ? mode : 'none';
}

/**
 * Handle initVideoContainer
 * @param {boolean} show
 */
function initVideoContainerShow(show = true) {
    initVideoContainer.style.width = show ? '100%' : 'auto';
}

/**
 * Check if peer name is set
 * @returns {string} Peer Name
 */
function getPeerName() {
    const qs = new URLSearchParams(window.location.search);
    const name = filterXSS(qs.get('name'));
    if (isHtml(name)) {
        console.log('Direct join', { name: 'Invalid name' });
        return 'Invalid name';
    }
    console.log('Direct join', { name: name });
    return name;
}

/**
 * Check if string contain html
 * @param {string} str
 * @returns
 */
function isHtml(str) {
    let a = document.createElement('div');
    a.innerHTML = str;
    for (let c = a.childNodes, i = c.length; i--; ) {
        if (c[i].nodeType == 1) return true;
    }
    return false;
}


/**
 * Load all Html elements by Id
 */
function getHtmlElementsById() {
    mySessionTime = getId('mySessionTime');
    // My video elements
    myVideo = getId('myVideo');
    myAudio = getId('myAudio');
    myVideoWrap = getId('myVideoWrap');
    myVideoAvatarImage = getId('myVideoAvatarImage');
    myPrivacyBtn = getId('myPrivacyBtn');
    myVideoPinBtn = getId('myVideoPinBtn');
    myPitchBar = getId('myPitchBar');
    // My username, hand/video/audio status
    myVideoParagraph = getId('myVideoParagraph');
    myHandStatusIcon = getId('myHandStatusIcon');
    myVideoStatusIcon = getId('myVideoStatusIcon');
    myAudioStatusIcon = getId('myAudioStatusIcon');
}

/**
 * Load settings from Local Storage
 */
async function loadLocalStorage() {
    const localStorageDevices = lS.getLocalStorageDevices();
    console.log('12. Get Local Storage Devices before', localStorageDevices);
    // Start init cam
    if (useVideo && initVideoSelect.value) {
        await changeInitCamera(initVideoSelect.value);
    }
}

/**
 * Change init camera by device id
 * @param {string} deviceId
 */
async function changeInitCamera(deviceId) {
    // Stop media tracks to avoid issue on mobile
    if (initStream) {
        await stopTracks(initStream);
    }
    if (localVideoMediaStream) {
        await stopVideoTracks(localVideoMediaStream);
    }

    // Get video constraints
    const videoConstraints = await getVideoConstraints('default');
    videoConstraints['deviceId'] = { exact: deviceId };
    
    navigator.mediaDevices
    .getUserMedia({ video: videoConstraints })
    .then((camStream) => {
        // We going to update init video stream
        initVideo.srcObject = camStream;
        initStream = camStream;

        console.log('Success attached init video stream', initStream.getVideoTracks()[0].getSettings());

        // We going to update also the local video stream
        myVideo.srcObject = camStream;
        localVideoMediaStream = camStream;
        console.log('Success attached local video stream', localVideoMediaStream.getVideoTracks()[0].getSettings());
    }).catch((err)=>{
        console.error('[Error] changeInitCamera', err);
        
    })
}


/**
 * Stop video track from MediaStream
 * @param {MediaStream} stream
 */
async function stopVideoTracks(stream) {
    if (!stream) return;
    stream.getTracks().forEach((track) => {
        if (track.kind === 'video') track.stop();
    });
}


/**
 * Generate random Room id if not set
 * @returns {string} Room Id
 */
function getRoomId() {
    // check if passed as params /join?room=id
    let qs = new URLSearchParams(window.location.search);
    let queryRoomId = filterXSS(qs.get('room'));

    // skip /join/
    let roomId = queryRoomId ? queryRoomId : window.location.pathname.substring(6);

    // if not specified room id, create one random
    if (roomId == '') {
        roomId = makeId(20);
        const newUrl = signalingServer + '/join/' + roomId;
        window.history.pushState({ url: newUrl }, roomId, newUrl);
    }
    console.log('Direct join', { room: roomId });

    // Update Room name in settings
    if (myRoomId) myRoomId.innerText = roomId;

    // Save room name in local storage
    window.localStorage.lastRoom = roomId;
    return roomId;
}

/**
 * Send async data to signaling server (server.js)
 * @param {string} msg msg to send to signaling server
 * @param {object} config data to send to signaling server
 */
async function sendToServer(msg, config = {}) {
    await signalingSocket.emit(msg, config);
}

/**
 * Date Format: https://convertio.co/it/
 * @returns {string} date string format: DD-MM-YYYY-H_M_S
 */
function getDataTimeString() {
    const d = new Date();
    const date = d.toISOString().split('T')[0];
    const time = d.toTimeString().split(' ')[0];
    return `${date}-${time}`;
}

/**
 * Get UUID4
 * @returns uuid4
 */
function getUUID() {
    const uuid4 = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
    );
    if (window.localStorage.uuid) {
        return window.localStorage.uuid;
    }
    window.localStorage.uuid = uuid4;
    return uuid4;
}


/**
 * Get Peer username
 * @returns {mixed} boolean false or username string
 */
function getPeerUsername() {
    if (window.sessionStorage.peer_username) return window.sessionStorage.peer_username;
    let qs = new URLSearchParams(window.location.search);
    let username = filterXSS(qs.get('username'));
    let queryUsername = false;
    if (username) {
        queryUsername = username;
    }
    console.log('Direct join', { username: queryUsername });
    return queryUsername;
}

/**
 * Get Peer password
 * @returns {mixed} boolean false or password string
 */
function getPeerPassword() {
    if (window.sessionStorage.peer_password) return window.sessionStorage.peer_password;
    let qs = new URLSearchParams(window.location.search);
    let password = filterXSS(qs.get('password'));
    let queryPassword = false;
    if (password) {
        queryPassword = password;
    }
    console.log('Direct join', { password: queryPassword });
    return queryPassword;
}

/**
 * Load Remote Media Stream obj
 * @param {MediaStream} stream media stream audio - video
 * @param {object} peers all peers info connected to the same room
 * @param {string} peer_id socket.id
 */
async function loadRemoteMediaStream(stream, peers, peer_id, kind) {
     // get data from peers obj
     console.log('REMOTE PEER INFO', peers[peer_id]);

     const peer_name = peers[peer_id]['peer_name'];
     const peer_audio = peers[peer_id]['peer_audio'];
     const peer_video = peers[peer_id]['peer_video'];
     const peer_video_status = peers[peer_id]['peer_video_status'];
     const peer_audio_status = peers[peer_id]['peer_audio_status'];
     const peer_screen_status = peers[peer_id]['peer_screen_status'];
     const peer_hand_status = peers[peer_id]['peer_hand_status'];
     const peer_rec_status = peers[peer_id]['peer_rec_status'];
     const peer_privacy_status = peers[peer_id]['peer_privacy_status'];
 
     if (stream) console.log('LOAD REMOTE MEDIA STREAM TRACKS - PeerName:[' + peer_name + ']', stream.getTracks());
    
     switch (kind) {
        case 'video':
            console.log('SETUP REMOTE VIDEO STREAM');

            // handle remote video elements
            const remoteVideoWrap = document.createElement('div');
            const remoteMedia = document.createElement('video');

            remoteMedia.setAttribute('id', peer_id + '___video');
            remoteMedia.setAttribute('playsinline', true);
            remoteMedia.autoplay = true;

            remoteVideoWrap.className = 'Camera';
            remoteVideoWrap.setAttribute('id', peer_id + '_videoWrap');

            // add elements to videoWrap div
            remoteVideoWrap.appendChild(remoteMedia);

            // append all elements to videoMediaContainer
            videoMediaContainer.appendChild(remoteVideoWrap);

            // attachMediaStream is a part of the adapter.js library
            attachMediaStream(remoteMedia, stream);

            break;
        case "audio":
            console.log('SETUP REMOTE AUDIO STREAM');
            // handle remote audio elements
            const remoteAudioWrap = document.createElement('div');
            const remoteAudioMedia = document.createElement('audio');

            const remoteAudioVolumeId = peer_id + '_audioVolume';
            remoteAudioMedia.id = peer_id + '___audio';
            remoteAudioMedia.autoplay = true;
            remoteAudioMedia.audio = 1.0;
            
            remoteAudioWrap.appendChild(remoteAudioMedia);
            audioMediaContainer.appendChild(remoteAudioWrap);

            attachMediaStream(remoteAudioMedia, stream);
            
            break;
        default:
            break;
     }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/ontrack
 * @param {string} peer_id socket.id
 * @param {object} peers all peers info connected to the same room
 */
// 交换完SDP之后，onTrack事件就会触发
// 此时有可能 IceCandidate 信息还没有完成交换，此过程与 IceCandidate 交换是独立的
// 如果 IceCandidate 交换完成后，就能实现p2p的信息交换了
async function handleOnTrack(peer_id, peers) {
    console.log('[ON TRACK] - peer_id', { peer_id: peer_id });

    peerConnections[peer_id].ontrack = (event) => {
        const remoteVideoStream = getId(`${peer_id}___video`);
        const remoteAudioStream = getId(`${peer_id}___audio`);
        const remoteAvatarImage = getId(`${peer_id}_avatar`);

        const peerInfo = peers[peer_id];
        const { peer_name } = peerInfo;
        const { kind } = event.track;

        console.log('[ON TRACK] - info', { peer_id, peer_name, kind });

        if (event.streams && event.streams[0]) {
            console.log('[ON TRACK] - peers', peers);
            
            switch (kind) {
                case 'video':
                    remoteVideoStream
                        ? attachMediaStream(remoteVideoStream, event.streams[0])
                        : loadRemoteMediaStream(event.streams[0], peers, peer_id, kind);
                    break;
                case 'audio':
                    remoteAudioStream && isAudioTrack
                        ? attachMediaStream(remoteAudioStream, event.streams[0])
                        : loadRemoteMediaStream(event.streams[0], peers, peer_id, kind);
                    break;
                default:
                    break;
            }

        } else {
            console.log('[ON TRACK] - SCREEN SHARING', { peer_id, peer_name, kind });
        }
    }
}


/**
 * Add my localVideoMediaStream and localAudioMediaStream Tracks to connected peer
 * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addTrack
 * @param {string} peer_id socket.id
 */
async function handleAddTracks(peer_id) {
    const peer_name = allPeers[peer_id]['peer_name'];

    const videoTrack = localVideoMediaStream && localVideoMediaStream.getVideoTracks()[0];
    const audioTrack = localAudioMediaStream && localAudioMediaStream.getAudioTracks()[0];


    console.log('handleAddTracks', {
        videoTrack: videoTrack,
        audioTrack: audioTrack,
    });

    if (videoTrack) {
        console.log('[ADD VIDEO TRACK] to Peer Name [' + peer_name + ']');
        await peerConnections[peer_id].addTrack(videoTrack, localVideoMediaStream);
    }


    if (audioTrack) {
        console.log('[ADD AUDIO TRACK] to Peer Name [' + peer_name + ']');
        await peerConnections[peer_id].addTrack(audioTrack, localAudioMediaStream);
    }
}