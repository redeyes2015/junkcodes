package HTMLHelper

import (
	"encoding/xml"
	"fmt"
	"io"
)

func NewHTMLDecoder(r io.Reader) *xml.Decoder {
	dec := xml.NewDecoder(r)

	dec.Strict = false
	dec.AutoClose = xml.HTMLAutoClose
	dec.Entity = xml.HTMLEntity
	return dec
}

func ExpectStartElement(dec *xml.Decoder, expected string) *xml.StartElement {
	for {
		var token xml.Token
		var err error
		if token, err = dec.Token(); err != nil {
			//fmt.Println("failed to parse result")
			//fmt.Println(err)
			break
		}

		if se, ok := token.(xml.StartElement); ok {
			if se.Name.Local == expected {
				return &se
			}
		}
	}

	return nil
}

func ExpectToken(dec *xml.Decoder, check func (xml.Token) bool) xml.Token{
	for {
		token, err := dec.Token()
		if err != nil {
			fmt.Println("fail to expect token!")
			return nil
		}
		if check(token) {
			return token
		}
	}
	fmt.Println("fail to expect token!")
	return nil
}

func TdValues(dec *xml.Decoder) []string {
	const (
		waitStartTD  = iota
		waitEndTD    = iota
		waitCharData = iota
	)
	currentState := waitStartTD
	names := make([]string, 0, 8)

	for {
		var token xml.Token
		var err error
		if token, err = dec.Token(); err != nil {
			fmt.Println("failed to parse result")
			fmt.Println(err)
			break
		}

		switch t := token.(type) {
		case xml.StartElement:
			switch name := t.Name.Local; name {
			case "td":
				currentState = waitCharData
			case "tr":
			default:
				fmt.Println("unexpected StartElement: %s", name)
				return nil
			}
		case xml.EndElement:
			switch name := t.Name.Local; name {
			case "td":
				if currentState == waitEndTD {
					currentState = waitStartTD
				} else {
					fmt.Println("see end of td, but not waiting for it")
					return nil
				}
			case "tr":
				if currentState != waitStartTD {
					fmt.Println("see end of tr at unexpected place!?")
				}
				return names
			default:
				fmt.Println("Unexpected EndElement!? %s", name)
				return nil
			}
		case xml.CharData:
			if currentState != waitCharData {
				continue
			}
			names = append(names, string(t.Copy()))
			currentState = waitEndTD
		default:
			return nil
		}

	}
	return nil
}
