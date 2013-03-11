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

func main() {
	var a, b, c int
	found := false
	for m := 1; m < 1000 && !found; m += 1 {
		for n := m + 1; n < 1000 && !found; n += 2 {
			if !is_coprime(m, n) {
				continue
			}
			a = n * n - m * m
			b = 2 * m * n
			c = n * n + m * m
			s := a + b + c
			if 1000 % s == 0 {
				fmt.Println(m, n)
				k := 1000 / s
				a, b, c = a * k, b * k, c *k
				found = true
			}
		}
	}
	fmt.Println(a, b, c)
	fmt.Println(int64(a) * int64(b) * int64(c))
}
