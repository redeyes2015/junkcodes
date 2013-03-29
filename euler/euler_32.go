package main

import "fmt"

func no_dup(n int, mark []bool) bool{
	if mark == nil {
		mark = make([]bool, 10)
	}
	for ; n > 0; n /= 10 {
		d := n % 10
		if d == 0 || mark[d] {
			return false
		}
		mark[d] = true
	}
	return true
}

func pan_check(a, b, prod int) bool {
	mark := make([]bool, 10)
	if !no_dup(a, mark) || !no_dup(b, mark) || !no_dup(prod, mark) {
		return false
	}
	for _, b := range mark[1:] {
		if ! b {
			return false
		}
	}
	return true
}

func main(){
	sum := 0
	for prod := 1234; prod <= 9876; prod += 1 {
		if !no_dup(prod, nil) {
			continue
		}
		for a := 1; a < 99; a += 1 {
			b := prod / a
			if a >= b {
				break
			}
			if !no_dup(a, nil) || (prod % a != 0) {
				continue
			}
			if pan_check(a, b, prod) {
				fmt.Println(a, b, prod)
				sum += prod
				break
			}
		}
	}
	fmt.Println("----")
	fmt.Println(sum)
}
