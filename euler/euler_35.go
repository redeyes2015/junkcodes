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

func main() {
	const LIMIT = 1000000
	prime_table = makePrimeTable(LIMIT)
	prime_list = makePrimeList(prime_table)

	digit := 1
	bond := 10
	totalCnt := 0
	for _, p := range prime_list {
		if p > bond {
			bond *= 10
			digit += 1
		}
		if ! prime_table[p] {
			continue
		}
		if digit > 1 {
			toBreak := false
			for t:= p; t > 0 && !toBreak; t /= 10 {
				d := t % 10
				if d % 2 == 0 || d == 5 {
					toBreak = true
				}
			}
			if toBreak {
				continue
			}
		}

		circularCnt := 1
		l := make([]int, digit)
		l[0] = p
		prime_table[p] = false
		top := bond / 10
		for next_p, i := p, 1; i < digit; i += 1{
			next_p = (next_p % 10) * top + next_p / 10
			if next_p == p {
				break
			}
			if ! prime_table[next_p] {
				circularCnt = 0
				break
			}
			l[i] = next_p
			prime_table[next_p] = false
			circularCnt += 1
		}
		if circularCnt == 0 {
			continue
		}
		totalCnt += circularCnt
		fmt.Println(l)
	}
	fmt.Println(totalCnt)
}
