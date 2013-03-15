package main

import "fmt"
import "sort"
import "io/ioutil"
import "bytes"

type BytesArr [][]byte

func (b BytesArr) Len () int {
	return len(b)
}

func (b BytesArr) Less (i, j int) bool {
	bi, bj := b[i], b[j]
	for k := 0; k < len(bi) && k < len(bj); k += 1 {
		switch {
		case bi[k] < bj[k]: return true
		case bi[k] > bj[k]: return false
		}
	}
	return len(bi) < len(bj)
}

func (b BytesArr) Swap (i, j int) {
	b[i], b[j] = b[j], b[i]
}


func main () {
	byte_arr, err := ioutil.ReadFile("names.txt")
	if err != nil {
		panic ("booom")
	}
	names_b := bytes.Split(byte_arr, []byte{','})
	for i, name := range names_b {
		names_b[i] = bytes.Trim(name, `"`)
	}
	sort.Sort(BytesArr(names_b))
	fmt.Println(string(names_b[0]), string(names_b[1]))
	fmt.Println(string(names_b[937]))
	foo := 0
	for _, b := range names_b[937] {
		foo += int(b - 'A' + 1)
	}
	fmt.Println(foo, foo * 938)
	
	
	sum := (0)
	for i, name := range names_b {
		s := 0
		for _, b := range name {
			s += int(b - 'A' + 1)
		}
		sum += (s) * ((i + 1))
	}
	fmt.Println(sum)
}
