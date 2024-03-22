package signaling

import (
	"encoding/json"

	"github.com/zengqiang96/webrtc/conference"
	"github.com/zengqiang96/webrtc/logging"
	"github.com/zengqiang96/webrtc/sdp"
)

type MessageContainer struct {
	Type string      `json:"type"`
	Data interface{} `json:"data"`
}

type BroadcastMessage struct {
	Message        []byte
	ExcludeClients []int
}

type WsHub struct {
	maxClientId       int
	clients           map[*WsClient]bool
	messageReceived   chan *ReveivedMessage
	broadcast         chan BroadcastMessage
	register          chan *WsClient
	unregister        chan *WsClient
	ConferenceManager *conference.ConferenceManager
}

func newWsHub(conferenceManager *conference.ConferenceManager) *WsHub {
	return &WsHub{
		register:          make(chan *WsClient),
		unregister:        make(chan *WsClient),
		clients:           make(map[*WsClient]bool),
		broadcast:         make(chan BroadcastMessage),
		messageReceived:   make(chan *ReveivedMessage),
		ConferenceManager: conferenceManager,
	}
}

func writeContainerJSON(client *WsClient, messageType string, messageData interface{}) {
	client.conn.WriteJSON(MessageContainer{
		Type: messageType,
		Data: messageData,
	})
}

func (h *WsHub) run() {
	for {
		select {
		case client := <-h.register:
			h.maxClientId++
			client.id = h.maxClientId
			h.clients[client] = true
			logging.Infof(logging.ProtoWS, "A new client connected: <u>client %d</u> (from <u>%s</u>)", client.id, client.conn.RemoteAddr())
			logging.Descf(logging.ProtoWS, "Sending welcome message via WebSocket. The client is informed with client ID given by the signaling server.")
			writeContainerJSON(client, "Welcome", ClientWelcomeMessage{
				Id:      client.id,
				Message: "Welcome!",
			})
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
				logging.Infof(logging.ProtoWS, "Client disconnected: <u>client %d</u> (from <u>%s</u>)", client.id, client.conn.RemoteAddr())
			}
		case receivedMessage := <-h.messageReceived:
			var messageObj map[string]interface{}
			json.Unmarshal(receivedMessage.Message, &messageObj)

			logging.Infof(logging.ProtoWS, "Message received from <u>client %d</u> type <u>%s</u>", receivedMessage.Sender.id, messageObj["type"])
			switch messageObj["type"] {
			case "JoinConference":
				h.processJoinConference(messageObj["data"].(map[string]interface{}), receivedMessage.Sender)
			case "SdpOfferAnswer":
				incomingSdpOfferAnswerMessage := sdp.ParseSdpOfferAnswer(messageObj["data"].(map[string]interface{}))
				incomingSdpOfferAnswerMessage.ConferenceName = receivedMessage.Sender.conference.ConferenceName
				h.ConferenceManager.ChanSdpOffer <- incomingSdpOfferAnswerMessage
			default:
				h.broadcast <- BroadcastMessage{
					Message: receivedMessage.Message,
				}
			}

		}
	}
}

func (h *WsHub) processJoinConference(messageData map[string]interface{}, wsClient *WsClient) {
	conferenceName := messageData["conferenceName"].(string)
	logging.Descf(logging.ProtoWS, "The <u>client %d</u> wanted to join the conference <u>%s</u>.", wsClient.id, conferenceName)
	wsClient.conference = h.ConferenceManager.EnsureConference(conferenceName)
	logging.Descf(logging.ProtoWS, "The client was joined the conference. Now we should generate an SDP Offer including our UDP candidates (IP-port pairs) and send to the client via Signaling/WebSocket.")
	sdpMessage := sdp.GenerateSdpOffer(wsClient.conference.IceAgent)
	logging.Infof(logging.ProtoSDP, "Sending SDP Offer to <u>client %d</u> (<u>%s</u>) for conference <u>%s</u>: %s", wsClient.id, wsClient.RemoteAddrStr(), conferenceName, sdpMessage)
	logging.LineSpacer(2)
	writeContainerJSON(wsClient, "SdpOffer", sdpMessage)
}
