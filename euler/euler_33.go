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

func check(n, d, nn, dd int) bool{
	if n * d * nn * dd == 0 {
		//fmt.Println(n, d, nn, dd)
		return false
	}
	g := gcd(n, d)
	n /= g
	d /= g

	g = gcd(nn, dd)
	nn /= g
	dd /= g
	return n == nn && d == dd
}

func main() {
	t_n := 1
	t_d := 1
	for n := 10; n < 100; n += 1 {
		for d := n + 1; d < 100; d += 1 {
			foo := false
			n1 := n / 10
			n2 := n % 10
			d1 := d / 10
			d2 := d % 10
			if n2 == 0 && d2 == 0 {
				continue
			}
			switch {
			case n1 == d1:
				foo = check(n, d, n2, d2)
			case n1 == d2:
				foo = check(n, d, n2, d1)
			case n2 == d1:
				foo = check(n, d, n1, d2)
			case n2 == d2:
				foo = check(n, d, n1, d1)
			}
			if foo {
				fmt.Println(n, d)
				g := gcd(n, d)
				t_n *= (n / g)
				t_d *= (d / g)
			}
		}
	}
	g := gcd(t_n, t_d)
	t_n /= g
	t_d /= g
	fmt.Println(t_n, t_d)
}
