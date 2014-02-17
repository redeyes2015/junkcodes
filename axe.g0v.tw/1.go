package main

import (
	"net/http"
	"encoding/xml"
	"fmt"
	"strconv"
	"os"
	"encoding/json"
	"./HTMLHelper"
)

type student struct {
	Name string `json:"name"`
	Grades map[string]int `json:"grades"`
}


func getSubjectNames(dec *xml.Decoder) []string {
	if vals := HTMLHelper.TdValues(dec); vals != nil {
		return vals[1:]
	}
	return nil
}

func main() {
	pageGet, err := http.Get("http://axe-level-1.herokuapp.com/")
	if err != nil {
		fmt.Println("failed to get page")
		return ;
	}

	dec := xml.NewDecoder(pageGet.Body)
	defer pageGet.Body.Close();

	dec.Strict = false
	dec.AutoClose = xml.HTMLAutoClose
	dec.Entity = xml.HTMLEntity

	if HTMLHelper.ExpectStartElement(dec, "head") == nil {
		fmt.Println("Can't find head!?")
		return
	} else {
		dec.Skip()
	}
	if HTMLHelper.ExpectStartElement(dec, "table") == nil {
		fmt.Println("Can't find table!?")
		return
	}

	sbjNames := getSubjectNames(dec)
	if sbjNames == nil {
		fmt.Println("Can't get subject names")
		return
	}

	students := make([]*student, 0, 16)
	for {
		if next := HTMLHelper.ExpectStartElement(dec, "tr"); next == nil {
			break
		}
		raw := HTMLHelper.TdValues(dec)
		if raw == nil {
			break
		}
		if len(raw) != len(sbjNames) + 1 {
			fmt.Println("length not matched")
			return
		}
		newStudent := new(student)
		newStudent.Name = raw[0]
		newStudent.Grades = make(map[string]int)
		for i, val := range(raw[1:]) {
			grade, err := strconv.Atoi(val)
			if err != nil {
				fmt.Println("grade format error: %s", val)
				return
			}
			newStudent.Grades[sbjNames[i]] = grade
		}

		students = append(students, newStudent)
	}

	json.NewEncoder(os.Stdout).Encode(students)
}
