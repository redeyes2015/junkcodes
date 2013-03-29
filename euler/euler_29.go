package main

import "fmt"
import "math"
import "sort"

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

type stdExp struct{
	primes, powers []int
}

func makeStdExp(n int) *stdExp {
	ret := new(stdExp)
	for _, p := range prime_list {
		if n == 1 {
			break
		}
		c := 0
		for n % p == 0 {
			c += 1
			n /= p
		}
		if c > 0 {
			ret.primes = append(ret.primes, p)
			ret.powers = append(ret.powers, c)
		}
	}
	if n != 1 {
		panic("noooooo")
	}
	return ret
}

func (n stdExp) pow(p int) *stdExp {
	ret := new(stdExp)
	ret.primes = n.primes
	ret.powers = make([]int, len(n.powers))
	for i, c := range(n.powers) {
		ret.powers[i] = c * p;
	}
	return ret
}

type repository []*stdExp

func (r repository) Len() int {
	return len(r)
}

func (r repository) Less(a, b int) bool {
	se_a, se_b := r[a], r[b];
	if len(se_a.primes) < len(se_b.primes) {
		return true
	}
	if len(se_a.primes) > len(se_b.primes) {
		return false
	}
	for i := 0; i < len(se_a.primes); i += 1 {
		if se_a.primes[i] < se_b.primes[i] {
			return true
		}
		if se_a.primes[i] > se_b.primes[i] {
			return false
		}
		if se_a.powers[i] < se_b.powers[i] {
			return true
		}
		if se_a.powers[i] > se_b.powers[i] {
			return false
		}
	}
	return false
}

func (r repository) Swap(i, j int) {
	r[i], r[j] = r[j], r[i]
}

func main () {
	const LIMIT = 100
	prime_table = makePrimeTable(LIMIT + 1)
	prime_list = makePrimeList(prime_table)

	repo := repository(make([]*stdExp, 0))
	for a := 2; a <= LIMIT; a += 1 {
		a_exp := makeStdExp(a)
		for b := 2; b <= LIMIT; b += 1 {
			t := a_exp.pow(b)
			repo = append(repo, t)
		}
	}
	fmt.Println(len(repo))
	sort.Sort(repository(repo))

	c := 1
	for i := 1; i < len(repo); i += 1 {
		if repo.Less(i - 1, i) {
			c += 1
		}
	}
	fmt.Println(c)

		/*
	for _, exp := range repo {
		fmt.Println(exp)
	}
	*/

}
