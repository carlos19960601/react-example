package signaling

import (
	"bytes"
	"time"

	"github.com/gorilla/websocket"
	"github.com/zengqiang96/webrtc/conference"
	"github.com/zengqiang96/webrtc/logging"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 81920
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type ClientWelcomeMessage struct {
	Id      int    `json:"id"`
	Message string `json:"message"`
}

type WsClient struct {
	id    int
	wsHub *WsHub
	conn  *websocket.Conn
	// Buffered channel of outbound messages.
	send       chan []byte
	conference *conference.Conference
}

func (c *WsClient) readPump() {
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(appData string) error {
		c.conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			logging.Errorf(logging.ProtoWS, "Receive error: %s", err)
			break
		}

		message = bytes.TrimSpace(bytes.Replace(message, newline, space, -1))

		c.wsHub.messageReceived <- &ReveivedMessage{
			Sender:  c,
			Message: message,
		}
	}
}

func (c *WsClient) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			n := len(c.send)
			for i := 0; i < n; i++ {
				w.Write(newline)
				w.Write(<-c.send)
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

type ReveivedMessage struct {
	Sender  *WsClient
	Message []byte
}

func (c *WsClient) RemoteAddrStr() string {
	if c.conn == nil {
		return "<nil>"
	}
	return c.conn.RemoteAddr().String()
}
