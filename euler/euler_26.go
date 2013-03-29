package main

import "fmt"
import "math"

func makePrimeTable (n int) []bool{
	sieve_tab := make([]bool, n)

	for i := 2; i < len(sieve_tab); i += 1 {
		sieve_tab[i] = true
	}

	upper_bound := int(math.Ceil(math.Sqrt(float64(len(sieve_tab)))))

	for i := 2; i < len(sieve_tab); i += 1 {
		if !sieve_tab[i] {
			continue
		}

		if i > upper_bound {
			continue
		}

		for n := i * i; n < len(sieve_tab); n += i {
			sieve_tab[n] = false
		}
	}
	return sieve_tab
}

func makePrimeList (table []bool) []int {
	ret := make([]int, 0)
	for i, b := range table {
		if b {
			ret = append(ret, i)
		}
	}
	return ret
}

var prime_table []bool
var prime_list []int

func prime_iter () (func() int) {
	i := -1
	return func () int {
		i += 1
		return prime_list[i]
	}
}

func totient (n int) int {
	ret := n
	p_iter := prime_iter();

	for n > 1 {
		p := p_iter()
		if n % p != 0 {
			continue
		}
		ret = ret / p * (p - 1)

		n /= p
		for n % p == 0 {
			n /= p
		}
	}
	return ret
}

func z_n (a, n int) int{
	a = a % n

	count := 1
	for t := (a * a) % n; t != a; t = (a * t) % n {
		count += 1
	}
	return count
}

func main () {
	const LIMIT = 1000
	prime_table = makePrimeTable(LIMIT)
	prime_list = makePrimeList(prime_table)

	for i := len(prime_list) - 1; i > 0; i -= 1 {
		p := prime_list[i]
		if totient(p) == z_n(10, p) {
			fmt.Println(p)
		}
	}
}

