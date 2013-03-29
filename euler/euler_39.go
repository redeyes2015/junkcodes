package main

import "fmt"

func gcd(a, b int) int {
	if a > b {
		a, b = b, a
	}
	c := b % a
	for c != 0 {
		a, b = c, a
		c = b % a
	}
	return a
}

func is_coprime(a, b int) bool {
	return gcd(a, b) == 1
}

func main(){
	coprime_count := make([]int, 1001)
	for m := 1; m < 1000; m += 1 {
		for n := m + 1; n < 1000; n += 1 {
			if !is_coprime(n, m) || !is_coprime(n * n - m * m, 2 * m *n) {
				continue
			}
			/*
			a = n * n - m * m
			b = 2 * m * n
			c = n * n + m * m
			*/
			p := 2 * n * (n + m)
			if p > 1000 {
				break
			}
			coprime_count[p] += 1
		}
	}

	max_poss := 0
	max_poss_p := -1
	for p := 840 ; p <= 840; p += 1 {
		poss := 0
		for t := 1; t < p; t += 1 {
			if p % t != 0 {
				continue
			}
			poss += coprime_count[p / t]
			if coprime_count[p / t] > 0 {
				fmt.Println(p, t, coprime_count[p / t])
			}
		}
		if poss > max_poss {
			max_poss = poss
			max_poss_p = p
		}
	}
	fmt.Println(max_poss_p, max_poss)
}
