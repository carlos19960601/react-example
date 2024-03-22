package signaling

import (
	"net/http"
	"sync"

	"github.com/zengqiang96/webrtc/conference"
	"github.com/zengqiang96/webrtc/logging"
)

type HttpServer struct {
	HttpServerAddr string
	wsHub          *WsHub
}

func NewHttpServer(httpServerAddr string, conferenceManager *conference.ConferenceManager) (*HttpServer, error) {
	wsHub := newWsHub(conferenceManager)
	httpServer := &HttpServer{
		HttpServerAddr: httpServerAddr,
		wsHub:          wsHub,
	}

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		httpServer.serveWs(w, r)
	})

	return httpServer, nil
}

func (s *HttpServer) Run(waitGroup *sync.WaitGroup) {
	defer waitGroup.Done()

	go s.wsHub.run()
	logging.Infof(logging.ProtoWS, "WebSocket Server started on <u>%s</u>", s.HttpServerAddr)
	logging.Descf(logging.ProtoWS, "Clients should make first contact with this WebSocket (the Signaling part)")

	err := http.ListenAndServe(s.HttpServerAddr, nil)
	if err != nil {
		panic(err)
	}
}

// serveWs handles websocket requests from the peer.
func (s *HttpServer) serveWs(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		logging.Errorf(logging.ProtoHTTP, "Error: %s", err)
		return
	}
	client := &WsClient{
		conn:  conn,
		wsHub: s.wsHub,
		send:  make(chan []byte, 256),
	}
	client.wsHub.register <- client

	go client.writePump()
	go client.readPump()
}
