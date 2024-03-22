package main

import (
	"fmt"
	"sync"

	"github.com/zengqiang96/webrtc/agent"
	"github.com/zengqiang96/webrtc/common"
	"github.com/zengqiang96/webrtc/conference"
	"github.com/zengqiang96/webrtc/config"
	"github.com/zengqiang96/webrtc/dtls"
	"github.com/zengqiang96/webrtc/logging"
	"github.com/zengqiang96/webrtc/signaling"
	"github.com/zengqiang96/webrtc/stun"
	"github.com/zengqiang96/webrtc/udp"
)

var (
	conferenceManager *conference.ConferenceManager
)

func main() {
	waitGroup := new(sync.WaitGroup)

	logging.Freef("", "Welcome to WebRTC Nuts and Bolts!")
	logging.Freef("", "=================================")
	logging.Freef("", "You can trace these logs to understand the WebRTC processes and flows.")
	logging.LineSpacer(3)

	logging.Infof(logging.ProtoAPP, "Reading configuration file...")
	config.Load()

	dtls.Init()

	discoveredServerIPs := discoverServerIPs()
	logging.Infof(logging.ProtoAPP, "Discovered IPs: [<u>%s</u>]", common.JoinSlice(", ", false, discoveredServerIPs...))
	logging.Descf(logging.ProtoAPP, "We looked to network device interfaces for IP addresses, and also asked \"what is my WAN IP?\" to the specified STUN server, via STUN protocol. Additionally, if defined, we add statically configured IP to the list. We use these IPs to create local ICE candidates (to say remote peers \"hey, I'm open to the network by these addresses and ports, maybe you can contact me by one of these IP-port pairs, I hope you can achieve with one of them.\").")

	conferenceManager = conference.NewConferenceManager(discoveredServerIPs, config.Val.Server.UDP.SinglePort)
	waitGroup.Add(1)
	go conferenceManager.Run(waitGroup)

	var udpListener = udp.NewUdpListener("0.0.0.0", config.Val.Server.UDP.SinglePort, conferenceManager)
	waitGroup.Add(1)
	go udpListener.Run(waitGroup)

	httpServer, err := signaling.NewHttpServer(fmt.Sprintf(":%d", config.Val.Server.Signaling.WsPort), conferenceManager)
	if err != nil {
		logging.Errorf(logging.ProtoAPP, "Http Server error: %s", err)
	}

	waitGroup.Add(1)
	go httpServer.Run(waitGroup)

	logging.Infof(logging.ProtoAPP, "Server components started...")
	logging.LineSpacer(2)
	waitGroup.Wait()
}

func discoverServerIPs() []string {
	localIPs := common.GetLocalIPs()
	result := []string{}
	result = append(result, localIPs...)

	logging.Infof(logging.ProtoAPP, "Discovered Local IPs: [<u>%s</u>]", common.JoinSlice(", ", false, result...))

	logging.Infof(logging.ProtoAPP, "Creating STUN Client...")

	stunClientUfrag := agent.GenerateICEUfrag()
	stunClientPwd := agent.GenerateICEPwd()
	stunClient := stun.NewStunClient(config.Val.Server.StunServerAddr, stunClientUfrag, stunClientPwd)
	mappedAddress, err := stunClient.Discover()
	if err != nil {
		logging.Errorf(logging.ProtoAPP, "[STUN] Discovery error: %s", err)
		return result
	}

	externalIP := mappedAddress.IP.To4().String()
	logging.Infof(logging.ProtoAPP, "Discovered external IP from STUN server (<u>%s</u>) as <u>%s</u>", stunClient.ServerAddr, externalIP)

	result = append(result, externalIP)
	return result
}
