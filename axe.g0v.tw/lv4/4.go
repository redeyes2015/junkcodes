package main

import (
	"../HTMLHelper"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
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

type foo bool

func (r foo) Error () string {
	return "foo!"
}

func getTownsFromPage(pageGet *http.Response) []*AreaLeader {
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
	baseURL := "http://axe-level-4.herokuapp.com/lv4/"
	var client http.Client

	towns := make([]*AreaLeader, 0, 128)
	for _, link := range getLinks(baseURL) {
		time.Sleep(time.Second / 5)

		url := baseURL + link
		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			fmt.Println("failed to create request")
			return
		}
		req.Header.Set("Referer", baseURL)
		req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0")
		pageGet, err := client.Do(req)
		if err != nil {
			fmt.Println("failed to get page")
			return
		}
		newTowns := getTownsFromPage(pageGet)
		if newTowns == nil {
			fmt.Println("foo")
			return
		}
		towns = append(towns, newTowns...)
	}

	if err := json.NewEncoder(os.Stdout).Encode(towns); err != nil {
		fmt.Println(err)
	}
}
