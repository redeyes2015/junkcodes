package main

import (
	"./HTMLHelper"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

type AreaLeader struct {
	Town    string `json:"town"`
	Village string `json:"village"`
	Name    string `json:"name"`
}

func getLinks(baseURL string) []string {
	pageGet, err := http.Get(baseURL)
	if err != nil {
		fmt.Println("failed to get page")
		return nil
	}
	dec := HTMLHelper.NewHTMLDecoder(pageGet.Body)
	defer pageGet.Body.Close()

	links := make([]string, 0, 12)
	for {
		aTag := HTMLHelper.ExpectStartElement(dec, "a")
		if aTag == nil {
			break
		}

		for _, attr := range aTag.Attr {
			if attr.Name.Local == "href" {
				links = append(links, attr.Value)
			}
		}
	}
	return links
}

func getTownsFromPage(url string) []*AreaLeader {
	pageGet, err := http.Get(url)
	if err != nil {
		fmt.Println("failed to get page")
		return nil
	}
	dec := HTMLHelper.NewHTMLDecoder(pageGet.Body)
	defer pageGet.Body.Close()

	if HTMLHelper.ExpectStartElement(dec, "tr") == nil {
		fmt.Println("failed to find tr")
		return nil
	}

	_ = HTMLHelper.TdValues(dec) // ignore title row

	towns := make([]*AreaLeader, 0, 10)
	for {
		if HTMLHelper.ExpectStartElement(dec, "tr") == nil {
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

	return towns
}

func main() {
	baseURL := "http://axe-level-1.herokuapp.com/lv2"

	townsChannel := make([]chan []*AreaLeader, 0, 12)
	for _, link := range getLinks(baseURL) {
		newCh := make(chan []*AreaLeader)
		townsChannel = append(townsChannel, newCh)

		go func(outCh chan<- []*AreaLeader, link string) {
			outCh <- getTownsFromPage(link)
		}(newCh, baseURL+link)
	}

	towns := make([]*AreaLeader, 0, 128)
	for _, ch := range townsChannel {
		towns = append(towns, (<-ch)...)
	}

	if err := json.NewEncoder(os.Stdout).Encode(towns); err != nil {
		fmt.Println(err)
	}
}
