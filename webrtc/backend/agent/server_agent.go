package agent

import (
	"github.com/zengqiang96/webrtc/dtls"
	"github.com/zengqiang96/webrtc/logging"
)

type ServerAgent struct {
	ConferenceName           string
	Ufrag                    string
	Pwd                      string
	Sockets                  map[string]UDPClientSocket
	IceCandidates            []*IceCandidate
	FingerprintHash          string
	SignalingMediaComponents map[string]*SignalingMediaComponent
}

type SignalingMediaComponent struct {
	Agent           *ServerAgent
	Ufrag           string
	Pwd             string
	FingerprintHash string
}

type IceCandidate struct {
	Ip   string
	Port int
}

func NewServerAgent(candidateIPs []string, udpPort int, conferenceName string) *ServerAgent {
	result := &ServerAgent{
		ConferenceName:           conferenceName,
		Ufrag:                    GenerateICEUfrag(),
		Pwd:                      GenerateICEPwd(),
		IceCandidates:            []*IceCandidate{},
		FingerprintHash:          dtls.ServerCertificateFingerprint,
		SignalingMediaComponents: map[string]*SignalingMediaComponent{},
		Sockets:                  map[string]UDPClientSocket{},
	}

	for _, candidateIP := range candidateIPs {
		result.IceCandidates = append(result.IceCandidates, &IceCandidate{
			Ip:   candidateIP,
			Port: udpPort,
		})
	}

	logging.Descf(logging.ProtoAPP, "A new server ICE Agent was created (for a new conference) with Ufrag: <u>%s</u>, Pwd: <u>%s</u>, FingerprintHash: <u>%s</u>", result.Ufrag, result.Pwd, result.FingerprintHash)
	return result
}

func (a *ServerAgent) EnsureSignalingMediaComponent(iceUfrag string, icePwd string, fingerprintHash string) *SignalingMediaComponent {
	result, ok := a.SignalingMediaComponents[iceUfrag]
	if ok {
		return result
	}
	result = &SignalingMediaComponent{
		Agent:           a,
		Ufrag:           iceUfrag,
		Pwd:             icePwd,
		FingerprintHash: fingerprintHash,
	}
	a.SignalingMediaComponents[iceUfrag] = result
	return result
}
