package main

import "fmt"

var step_map map[int64]int64

func calc_step(n int64) int64 {
	if res, known := step_map[n]; known {
		return res
	}
	if n < 0 {
		panic("booooom")
	}

	var next int64
	if (n & 1) == 1 {
		next = 3 * n + 1
	} else {
		next = n / 2
	}
	step_map[n] = calc_step(next) + 1
	return step_map[n]
}

func main () {
	step_map = make(map[int64]int64)
	step_map[1] = 1

	_ = calc_step(2)

	max_step_n, max_step := 1, int64(1)
	for i := 2; i < 1000000; i += 1 {
		s := calc_step(int64(i))
		if s > max_step {
			max_step = s
			max_step_n = i
		}
	}
	fmt.Println(max_step_n, max_step, len(step_map))
}
