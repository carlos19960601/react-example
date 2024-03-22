package dtls

import (
	"encoding/binary"
	"fmt"
)

type HandshakeType uint8

const (
	HandshakeTypeHelloRequest       HandshakeType = 0
	HandshakeTypeClientHello        HandshakeType = 1
	HandshakeTypeServerHello        HandshakeType = 2
	HandshakeTypeHelloVerifyRequest HandshakeType = 3
	HandshakeTypeCertificate        HandshakeType = 11
	HandshakeTypeServerKeyExchange  HandshakeType = 12
	HandshakeTypeCertificateRequest HandshakeType = 13
	HandshakeTypeServerHelloDone    HandshakeType = 14
	HandshakeTypeCertificateVerify  HandshakeType = 15
	HandshakeTypeClientKeyExchange  HandshakeType = 16
	HandshakeTypeFinished           HandshakeType = 20
)

type HandshakeHeader struct {
	HandshakeType   HandshakeType
	Length          uint24
	MessageSequence uint16
	FragmentOffset  uint24
	FragmentLength  uint24
}

func (ht HandshakeType) String() string {
	var result string
	switch ht {
	case HandshakeTypeHelloRequest:
		result = "HelloRequest"
	case HandshakeTypeClientHello:
		result = "ClientHello"
	case HandshakeTypeServerHello:
		result = "ServerHello"
	case HandshakeTypeHelloVerifyRequest:
		result = "VerifyRequest"
	case HandshakeTypeCertificate:
		result = "Certificate"
	case HandshakeTypeServerKeyExchange:
		result = "ServerKeyExchange"
	case HandshakeTypeCertificateRequest:
		result = "CertificateRequest"
	case HandshakeTypeServerHelloDone:
		result = "ServerHelloDone"
	case HandshakeTypeCertificateVerify:
		result = "CertificateVerify"
	case HandshakeTypeClientKeyExchange:
		result = "ClientKeyExchange"
	case HandshakeTypeFinished:
		result = "Finished"
	default:
		result = "Unknown type"
	}
	return fmt.Sprintf("%s (%d)", result, uint8(ht))
}

func DecodeHandshakeHeader(buf []byte, offset int, arrayLen int) (*HandshakeHeader, int, error) {
	result := new(HandshakeHeader)

	result.HandshakeType = HandshakeType(buf[offset])
	offset++
	result.Length = NewUint24FromBytes(buf[offset : offset+3])
	offset += 3
	result.MessageSequence = binary.BigEndian.Uint16(buf[offset : offset+2])
	offset += 2
	result.FragmentOffset = NewUint24FromBytes(buf[offset : offset+3])
	offset += 3
	result.FragmentLength = NewUint24FromBytes(buf[offset : offset+3])
	offset += 3
	return result, offset, nil
}

func (h *HandshakeHeader) Encode() []byte {
	result := make([]byte, 12)
	result[0] = byte(h.HandshakeType)
	copy(result[1:], h.Length[:])
	binary.BigEndian.PutUint16(result[4:], h.MessageSequence)
	copy(result[6:], h.FragmentOffset[:])
	copy(result[9:], h.FragmentLength[:])
	return result
}
