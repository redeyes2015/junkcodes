package main

import "fmt"
import "math"

func makePrimeList (n int) ([]bool, []int) {
	sieve_tab := make([]bool, n)
	prime_list := make([]int, 0)

	for i := 2; i < len(sieve_tab); i += 1 {
		sieve_tab[i] = true
	}

	upper_bound := int(math.Ceil(math.Sqrt(float64(len(sieve_tab)))))

	for i := 2; i < len(sieve_tab); i += 1 {
		if !sieve_tab[i] {
			continue
		}
		prime_list = append(prime_list, i)

		if i > upper_bound {
			continue
		}

		for n := i * i; n < len(sieve_tab); n += i {
			sieve_tab[n] = false
		}
	}
	return sieve_tab, prime_list
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

func getD (n int) int {
	if n < len(prime_table) && prime_table[n] {
		return 1
	}
	prod := 1

	remain := n
	p_iter := prime_iter()
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
	return prod - n
}

func main () {
	const LIMIT = 10000
	prime_table, prime_list = makePrimeList(2 * LIMIT)
	

	//fmt.Println(getD(220), getD(284))
	d_table := make([]int, LIMIT)
	check_table := make([]bool, LIMIT)
	check_table[0] = true
	check_table[1] = true
	sum := (0)
	for a, v := range d_table {
		if check_table[a] {
			continue
		}
		if v == 0 {
			v = getD(a)
			d_table[a] = v
		}
		if v == a { // a is perfect number
			continue
		}
		var b int
		if v >= LIMIT || d_table[v] == 0 {
			b = getD(v)
		} else {
			b = d_table[v]
		}
		if a == b {
			fmt.Println(a, v, b)
			sum += (a)
			check_table[a] = true
			if v < LIMIT {
				check_table[v] = true
				sum += (v)
			}
		}
	}
	fmt.Println(sum)
}
