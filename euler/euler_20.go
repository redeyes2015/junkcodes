package main

import "fmt"
import "math/big"

func main () {
	prod := new (big.Int)
	prod.SetInt64(int64(1))
	for i := 2; i <= 100; i += 1 {
		a := new(big.Int)
		a.SetInt64(int64(i))
		prod = prod.Mul(prod, a)
	}
	sum := 0
	for _, r := range []rune(prod.String()) {
		switch r {
		case '1': sum += 1
		case '2': sum += 2
		case '3': sum += 3
		case '4': sum += 4
		case '5': sum += 5
		case '6': sum += 6
		case '7': sum += 7
		case '8': sum += 8
		case '9': sum += 9
		}
	}
	fmt.Println(sum)
}
