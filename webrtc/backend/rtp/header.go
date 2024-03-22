package rtp

import "fmt"

type PayloadType byte

const (
	PayloadTypeVP8  PayloadType = 96
	PayloadTypeOpus PayloadType = 109
)

func (pt PayloadType) CodecCodeNumber() string {
	return fmt.Sprintf("%d", int(pt))
}

func (pt PayloadType) CodecName() string {
	var result string
	switch pt {
	case PayloadTypeVP8:
		result = "VP8/90000"
	case PayloadTypeOpus:
		result = "OPUS/48000/2"
	default:
		result = "Unknown"
	}
	return result
}
