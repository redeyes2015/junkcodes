package main

import "fmt"

func is_bin_palindrome(n int) bool {
	b := make([]bool, 0, 64)
	for t, i := n, 0 ; t > 0; t, i = t/2, i+1 {
		b = append(b, t & 1 == 1)
	}
	for i, j := 0, len(b) - 1; i < j; i, j = i + 1, j - 1 {
		if b[i] != b[j] {
			return false
		}
	}
	return true
}

func gen10palin_helper(stack []int, remain int, out_chan chan<- int) {
	stack_l := len(stack)
	if remain < stack_l {
		t := stack[stack_l - 1]
		pos := 10
		for i := len(stack) - 2; i >=0 ; i -= 1 {
			t = (stack[i] * pos + t)*10 + stack[i]
			pos *= 100
		}
		out_chan <- t
		return
	}
	if remain == stack_l {
		t := 0
		pos := 1
		for i := len(stack) - 1; i >=0 ; i -= 1 {
			t = (stack[i] * pos + t)*10 + stack[i]
			pos *= 100
		}
		out_chan <- t
		return
	}
	remain -= 1
	for i := 0; i < 10; i += 1 {
		stack_t := append(stack, i)
		gen10palin_helper(stack_t, remain, out_chan)
	}
}

func gen10palin(target_len int, out_chan chan<- int) {
	odd_digit := []int{1,3,5,7,9}

	for _, d := range odd_digit {
		stack := make([]int, 1, (target_len + 1)/2)
		stack[0] = d
		gen10palin_helper(stack, target_len - 1, out_chan)
	}
	out_chan <- 0
}

func main () {
	gen_chan := make(chan int)

	sum := 0
	for l := 1; l < 7; l += 1 {
		go gen10palin(l, gen_chan)
		for n := range gen_chan {
			if n == 0 {
				break
			}
			if is_bin_palindrome(n) {
				fmt.Println(n)
				sum += n
			}
		}
	}
	fmt.Println(sum)
}
