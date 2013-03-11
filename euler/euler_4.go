package main

import "fmt"

func is_palindrome (n int) bool {
	s := fmt.Sprintf("%d", n)
	s_l := len(s) - 1

	for i := 0; (i + i) < s_l; i += 1 {
		if s[i] != s[s_l - i] {
			return false
		}
	}
	return true
}

func produc_gen (low, high int, out chan<- int) {
	for i := high - 1; i >= low; i -= 1 {
		for j := high - 1; j >= i; j -= 1 {
			p := i * j
			if is_palindrome(p) {
				out <- p
				break
			}
		}
	}
	close(out)
}

func produc_gen2 (out chan<- int) {
	high := 1000
	low := 100
	for i := high - 1; i >= low; i -= 1 {
		for j := 990; j >= low; j -= 11 {
			p := i * j
			if is_palindrome(p) {
				out <- p
				break
			}
		}
	}
	close(out)
}

func main (){
	produc_chan := make(chan int)

	max := 0
	//go produc_gen(100, 1000, produc_chan)
	go produc_gen2(produc_chan)
	for {
		prod, ok := <- produc_chan
		if !ok || prod == -1 {
			break
		}
		if prod > max {
			max = prod
		}
	}

	fmt.Println(max)
}

