package main

import "fmt"


func isPrime(n int) bool {
	switch {
	case n == 1: return false
	case n == 2: return true
	case (n & 1) == 0: return false
	}
	for i := 3 ; (i + i) < n; i += 1 {
		if n % i == 0 {
			return false
		}
	}
	return true
}

func join_digit(l []int) int {
	t := 0
	for _, d := range l {
		t = t * 10 + d
	}
	return t
}

func finder (out_chan chan<- []int) {
	first_poss := []int{2,3,5,7}
	mid_poss := []int{1,3,7,9}
	//possible_digits := []int{1,2,3,4,5,6,7,8,9}
	var helper (func (stack[]int))

	helper = func (stack []int) {
		stack = append(stack, 0)
		stack_l := len(stack)
		var possible_digits []int
		if stack_l == 1 {
			possible_digits = first_poss
		} else {
			possible_digits = mid_poss
		}
		for _, d := range possible_digits {
			stack[stack_l - 1] = d
			doRecurs := isPrime(join_digit(stack))
			is_truncatable := (d == 7 || d == 3) && doRecurs && (stack_l != 1)
			for i := stack_l - 1; is_truncatable && i > 0; i -= 1{
				is_truncatable = isPrime(join_digit(stack[i:]))
			}
			if is_truncatable {
				out_chan <- stack
				stack_t := make([]int, stack_l)
				_ = copy(stack_t, stack)
				stack = stack_t
			}
			if doRecurs {
				helper(stack)
			}
		}
	}

	helper (make([]int, 0))
	out_chan <- nil
}

func main () {
	gen_chan := make(chan []int)
	go finder(gen_chan)

	sum := 0
	for s := range gen_chan {
		if s == nil {
			break
		}
		fmt.Println(s)
		sum += join_digit (s)
	}
	fmt.Println(sum)
}
