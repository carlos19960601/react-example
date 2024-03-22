package sdp

import (
	"fmt"

	"github.com/zengqiang96/webrtc/agent"
	"github.com/zengqiang96/webrtc/common"
	"github.com/zengqiang96/webrtc/config"
	"github.com/zengqiang96/webrtc/logging"
	"github.com/zengqiang96/webrtc/rtp"
)

type MediaType string

const (
	MediaTypeVideo MediaType = "video"
	MediaTypeAudio MediaType = "audio"
)

type CandidateType string

const (
	CandidateTypeHost CandidateType = "host"
)

type TransportType string

const (
	TransportTypeUdp TransportType = "udp"
	TransportTypeTcp TransportType = "tcp"
)

type FingerprintType string

const (
	FingerprintTypeSHA256 FingerprintType = "sha-256"
)

type SdpMessage struct {
	ConferenceName string
	SessionID      string     `json:"sessionId"`
	MediaItems     []SdpMedia `json:"mediaItems"`
}

type SdpMedia struct {
	MediaId         int                 `json:"mediaId"`
	Type            MediaType           `json:"type"`
	Ufrag           string              `json:"ufrag"`
	Pwd             string              `json:"pwd"`
	Candidates      []SdpMediaCandidate `json:"candidates"`
	FingerprintType FingerprintType     `json:"fingerprintType"`
	FingerprintHash string              `json:"fingerprintHash"`
	Payloads        string              `json:"payloads"`
	RTPCodec        string              `json:"rtpCodec"`
}

type SdpMediaCandidate struct {
	Ip        string        `json:"ip"`
	Port      int           `json:"port"`
	Type      CandidateType `json:"type"`
	Transport TransportType `json:"transport"`
}

func GenerateSdpOffer(iceAgent *agent.ServerAgent) *SdpMessage {
	candidates := []SdpMediaCandidate{}
	for _, agentCandidate := range iceAgent.IceCandidates {
		candidates = append(candidates, SdpMediaCandidate{
			Ip:        agentCandidate.Ip,
			Port:      agentCandidate.Port,
			Type:      "host",
			Transport: TransportTypeUdp,
		})
	}

	offer := &SdpMessage{
		SessionID: "a_sessId",
		MediaItems: []SdpMedia{
			{
				MediaId:         0,
				Type:            MediaTypeVideo,
				Payloads:        rtp.PayloadTypeVP8.CodecCodeNumber(), //96
				RTPCodec:        rtp.PayloadTypeVP8.CodecName(),       //VP8/90000
				Ufrag:           iceAgent.Ufrag,
				Pwd:             iceAgent.Pwd,
				FingerprintType: FingerprintTypeSHA256,
				FingerprintHash: iceAgent.FingerprintHash,
				Candidates:      candidates,
			},
		},
	}
	if config.Val.Server.RequestAudio {
		offer.MediaItems = append(offer.MediaItems, SdpMedia{
			MediaId:         1,
			Type:            MediaTypeAudio,
			Payloads:        rtp.PayloadTypeOpus.CodecCodeNumber(), //109
			RTPCodec:        rtp.PayloadTypeOpus.CodecName(),       //OPUS/48000/2
			Ufrag:           iceAgent.Ufrag,
			Pwd:             iceAgent.Pwd,
			FingerprintType: FingerprintTypeSHA256,
			FingerprintHash: iceAgent.FingerprintHash,
			Candidates:      candidates,
		})
	}

	return offer
}

func ParseSdpOfferAnswer(offer map[string]interface{}) *SdpMessage {
	sdpMessage := &SdpMessage{}
	sdpMessage.SessionID = offer["origin"].(map[string]interface{})["sessionId"].(string)

	mediaItems := offer["media"].([]interface{})

	for _, mediaItemObj := range mediaItems {
		sdpMedia := SdpMedia{}
		mediaItem := mediaItemObj.(map[string]interface{})
		//mediaId := mediaItem["mid"].(float64)
		sdpMedia.Type = MediaType(mediaItem["type"].(string))
		candidates := mediaItem["candidates"].([]interface{})
		sdpMedia.Ufrag = mediaItem["iceUfrag"].(string)
		sdpMedia.Pwd = mediaItem["icePwd"].(string)
		//iceOptions := mediaItem["iceOptions"].(string)
		fingerprint := mediaItem["fingerprint"].(map[string]interface{})
		sdpMedia.FingerprintType = FingerprintType(fingerprint["type"].(string))
		sdpMedia.FingerprintHash = fingerprint["hash"].(string)
		//direction := mediaItem["direction"].(string)
		for _, candidateObj := range candidates {
			sdpMediaCandidate := SdpMediaCandidate{}
			candidate := candidateObj.(map[string]interface{})
			//foundation := candidate["foundation"].(float64)
			sdpMediaCandidate.Type = CandidateType(candidate["type"].(string))
			sdpMediaCandidate.Transport = TransportType(candidate["transport"].(string))
			sdpMediaCandidate.Ip = candidate["ip"].(string)
			sdpMediaCandidate.Port = int(candidate["port"].(float64))
			sdpMedia.Candidates = append(sdpMedia.Candidates, sdpMediaCandidate)
		}
		sdpMessage.MediaItems = append(sdpMessage.MediaItems, sdpMedia)
	}
	logging.Descf(logging.ProtoSDP, "It seems the client has received our SDP Offer, processed it, accepted it, initialized it's media devices (webcam, microphone, etc...), started it's UDP listener, and sent us this SDP Answer. In this project, we don't use the client's candidates, because we has implemented only receiver functionalities, so we don't have any media stream to send :)")
	logging.Infof(logging.ProtoSDP, "Processing Incoming SDP: %s", sdpMessage)
	logging.LineSpacer(2)
	return sdpMessage
}

func (m *SdpMessage) String() string {
	mediaItemsStr := make([]string, len(m.MediaItems))
	i := 0
	for _, media := range m.MediaItems {
		mediaItemsStr[i] = fmt.Sprintf("[SdpMedia] %s", media)
		i++
	}

	return common.JoinSlice("\n", false,
		fmt.Sprintf("SessionID: <u>%s</u>", m.SessionID),
		common.ProcessIndent("MediaItems:", "+", mediaItemsStr),
	)
}

func (m SdpMedia) String() string {
	candidatesStr := make([]string, len(m.Candidates))
	i := 0
	for _, candidate := range m.Candidates {
		candidatesStr[i] = fmt.Sprintf("[SdpCandidate] %s", candidate)
		i++
	}

	return common.JoinSlice("\n", false,
		common.ProcessIndent(fmt.Sprintf("MediaId: <u>%d</u>, Type: %s, Ufrag: <u>%s</u>, Pwd: <u>%s</u>", m.MediaId, m.Type, m.Ufrag, m.Pwd), "", []string{
			fmt.Sprintf("FingerprintType: <u>%s</u>, FingerprintHash: <u>%s</u>", m.FingerprintType, m.FingerprintHash),
			common.ProcessIndent("Candidates:", "+", candidatesStr),
		}))
}

func (m SdpMediaCandidate) String() string {
	return fmt.Sprintf("Type: <u>%s</u>, Transport: <u>%s</u>, Ip: <u>%s</u>, Port: <u>%d</u>", m.Type, m.Transport, m.Ip, m.Port)
}
