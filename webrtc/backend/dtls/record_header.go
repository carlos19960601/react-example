package dtls

import "encoding/binary"

type ContentType uint8

type DtlsVersion uint16

const (
	SequenceNumberSize = 6 // 48 bit

	ContentTypeChangeCipherSpec ContentType = 20
	ContentTypeAlert            ContentType = 21
	ContentTypeHandshake        ContentType = 22
	ContentTypeApplicationData  ContentType = 23

	DtlsVersion1_0 DtlsVersion = 0xfeff
	DtlsVersion1_2 DtlsVersion = 0xfefd
)

type RecordHeader struct {
	ContentType    ContentType
	Version        DtlsVersion
	Epoch          uint16
	SequenceNumber [SequenceNumberSize]byte
	Length         uint16
}

func DecodeRecordHeader(buf []byte, offset int, arrayLen int) (*RecordHeader, int, error) {
	result := new(RecordHeader)

	result.ContentType = ContentType(buf[offset])
	offset++
	result.Version = DtlsVersion(binary.BigEndian.Uint16(buf[offset : offset+2]))
	offset += 2
	result.Epoch = binary.BigEndian.Uint16(buf[offset : offset+2])
	offset += 2
	copy(result.SequenceNumber[:], buf[offset:offset+SequenceNumberSize])
	offset += SequenceNumberSize
	result.Length = binary.BigEndian.Uint16(buf[offset : offset+2])
	offset += 2
	return result, offset, nil
}

func (h *RecordHeader) Encode() []byte {
	result := make([]byte, 7+SequenceNumberSize)
	result[0] = byte(h.ContentType)
	binary.BigEndian.PutUint16(result[1:], uint16(h.Version))
	binary.BigEndian.PutUint16(result[3:], uint16(h.Epoch))
	copy(result[5:], h.SequenceNumber[:])
	binary.BigEndian.PutUint16(result[5+SequenceNumberSize:], uint16(h.Length))
	return result
}
