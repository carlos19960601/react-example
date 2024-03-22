package common

import "strings"

func JoinSlice(separator string, indent bool, lines ...string) string {
	result := ""
	for i, line := range lines {
		if indent {
			result += "\t"
		}
		result += line
		if i < len(lines)-1 {
			result += separator
		}
	}
	return result
}

func ProcessIndent(title string, bullet string, lines []string) string {
	result := title
	if result != "" {
		result += "\n"
	}
	for i, line := range lines {
		result += "\t"
		if bullet != "" {
			result += bullet + " "
		}
		if strings.Contains(line, "\n") {
			parts := strings.Split(line, "\n")
			result += ProcessIndent(parts[0], "", parts[1:])
		} else {
			result += line
		}
		if i < len(lines)-1 {
			result += "\n"
		}
	}
	return result
}
