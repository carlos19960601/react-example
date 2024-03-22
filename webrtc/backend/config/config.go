package config

import (
	"fmt"

	"github.com/spf13/viper"
)

type Configurations struct {
	Server ServerConfigurations
}

type ServerConfigurations struct {
	SoftwareName   string
	Signaling      SignalingConfigurations
	StunServerAddr string
	UDP            UDPConfigurations
	DomainName     string
	RequestAudio   bool
}

type SignalingConfigurations struct {
	WsPort int
}

type UDPConfigurations struct {
	SinglePort   int
	DockerHostIp string
}

var Val Configurations

func Load() {
	// 设置配置文件名字
	viper.SetConfigName("config")

	// 设置配置文件路径
	viper.AddConfigPath(".")
	viper.AddConfigPath("../")

	// 从环境变量中读取
	viper.AutomaticEnv()

	viper.SetConfigType("yml")

	if err := viper.ReadInConfig(); err != nil {
		fmt.Printf("Error reading config file, %s", err)
	}

	err := viper.Unmarshal(&Val)
	if err != nil {
		fmt.Printf("Unable to decode into struct, %v", err)
	}
}
