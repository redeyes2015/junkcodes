package main

import (
	"../HTMLHelper"
	"encoding/xml"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/cookiejar"
	"os"
)

type AreaLeader struct {
	Town    string `json:"town"`
	Village string `json:"village"`
	Name    string `json:"name"`
}


func parsePage(resp *http.Response) ([]*AreaLeader, bool) {
	dec := HTMLHelper.NewHTMLDecoder(resp.Body)
	defer resp.Body.Close()

	tableStart := HTMLHelper.ExpectStartElement(dec, "table")
	if tableStart == nil ||
			HTMLHelper.ExpectStartElement(dec, "tr") == nil {
		fmt.Println("title row not found...")
		return nil, false
	}

	checkTableEnd := func(token xml.Token) bool {
		if ee, ok := token.(xml.EndElement); ok {
			return ee.Name.Local == "table"
		}
		return false
	}
	checkRowStart := func(token xml.Token) bool {
		if se, ok := token.(xml.StartElement); ok {
			return se.Name.Local == "tr"
		}
		return false
	}

	towns := make([]*AreaLeader, 0, 10)
	for {
		token := HTMLHelper.ExpectToken(dec, func(token xml.Token) bool {
			return checkTableEnd(token) || checkRowStart(token)
		});
		if token == nil {
			fmt.Println("Unexpected end ...")
			return nil, false
		}
		if checkTableEnd(token) {
			break
		}
		raw := HTMLHelper.TdValues(dec)
		if raw == nil {
			break
		}
		town := new(AreaLeader)
		town.Town = raw[0]
		town.Village = raw[1]
		town.Name = raw[2]
		towns = append(towns, town)
	}

	hasNext := false
	for !hasNext {
		aToken := HTMLHelper.ExpectStartElement(dec, "a")
		if aToken == nil {
			break
		}
		for _, attr := range aToken.Attr {
			if attr.Name.Local == "href" && attr.Value == "?page=next" {
				hasNext = true
				break
			}
		}
	}
	return towns, hasNext
}

func main() {
	baseURL := "http://axe-level-1.herokuapp.com/lv3"
	firstPage := true

	jar, err := cookiejar.New(nil)
	if err != nil {
		fmt.Println("cannot create cookiejar!?")
		return
	}
	client := http.Client{Jar: jar}

	towns := make([]*AreaLeader, 0, 1024)
	for {
		var resp *http.Response
		if resp, err = client.Get(baseURL); err != nil {
			fmt.Println("cannot get page!?")
			return
		}
		if firstPage {
			firstPage = false
			baseURL = baseURL + "?page=next"
		}
		newTowns, hasNext := parsePage(resp)

		towns = append(towns, newTowns...)
		if !hasNext {
			break
		}
	}
	//fmt.Println("len(towns)", len(towns))
	
	if err := json.NewEncoder(os.Stdout).Encode(towns); err != nil {
		fmt.Println(err)
	}
}
