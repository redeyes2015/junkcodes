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

func prime_iter (list []int) (func() int) {
	i := -1
	return func () int {
		i += 1
		return prime_list[i]
	}
}

func isAbundant (n int) bool{
	if prime_table[n] {
		return false
	}
	prod := (1)

	remain := n
	p_iter := prime_iter(prime_list)
	for remain > 1 && prod <= n {
		p := p_iter()
		t := p
		s_t := 1
		for remain % p == 0 {
			s_t += t
			t *= p
			remain /= p
		}
		prod *= (s_t)
	}
	return prod > (n + n)
}

func main () {
	const LIMIT = 28124
	prime_table = makePrimeTable(LIMIT)
	prime_list = makePrimeList(prime_table)

	ab_sum_able := make([]bool, LIMIT)
	ab_list := make([]int, 0)

	for i := 1; i < LIMIT; i += 1 {
		if !isAbundant(i) {
			continue
		}
		ab_list = append(ab_list, i)

		for _, j := range ab_list {
			if t := i + j; t < LIMIT {
				ab_sum_able[t] = true
			}
		}
	}
	sum := 0
	for i, b := range ab_sum_able {
		if !b {
			sum += i
		}
	}
	fmt.Println(sum)
}

