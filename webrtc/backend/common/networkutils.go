package common

import (
	"net"
)

func GetLocalIPs() []string {
	result := make([]string, 0)
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		return result
	}
	for _, addr := range addrs {
		if ipnet, ok := addr.(*net.IPNet); ok {
			if ipnet.IP.To4() != nil && !ipnet.IP.IsLoopback() {
				result = append(result, ipnet.IP.String())
			}
		}
	}

	return result
}
