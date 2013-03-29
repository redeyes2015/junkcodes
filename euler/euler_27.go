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

func getLongestStrip(a, b int) int {
	if b <= 0 || !prime_table[b] {
		return -1
	}
	f_n := b
	n := 0
	for {
		f_n = f_n + a + n + n + 1

		if f_n >= len(prime_table) {
			panic(fmt.Sprint("Out of Index?!", f_n))
		}
		if f_n < 0 || !prime_table[f_n] {
			return n
		}
		n += 1
	}
	panic ("fooooooo~~~~")
}

func main() {
	const LIMIT = 100000
	prime_table = makePrimeTable(LIMIT)
	prime_list = makePrimeList(prime_table)

	max_a := 1
	max_b := 41
	max_l := 39

	for a := -999; a <= 999; a += 1 {
		for b := 2; b <= 999; b += 1 {
			l := getLongestStrip(a, b)
			if l > max_l {
				max_a = a
				max_b = b
				max_l = l
			}
		}
	}
	fmt.Println(max_a, max_b, max_l, max_a * max_b)
}
