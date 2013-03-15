package main

import (
	"fmt"
	"math/big"
)

func main () {
	a := big.NewInt(int64(1))
	b := a
	count := 2

	for {
		c := new(big.Int)
		c.Add(a, b)
		count += 1
		if len(c.String()) >= 1000 {
			break
		}
		a, b = b, c
	}
	fmt.Println(count)
}
