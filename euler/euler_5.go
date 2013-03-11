package main

import "fmt"

var known_primes []int

func init_known_primes () {
	known_primes = make([]int, 0, 20)
	known_primes = append(known_primes, 2, 3)
}

func is_prime (n int) bool {
	for _, p := range(known_primes) {
		if (p + p) > n {
			break
		}
		if (n % p) == 0 {
			return false
		}
	}
	return true
}

func expand_known_primes () int {
	try := 2 + known_primes[len(known_primes) -1]
	for !is_prime(try) {
		try += 2
	}
	known_primes = append(known_primes, try)
	return try
}


func prime_iter () (func () int) {
	i := 0
	return func () (ret int){
		if i < len(known_primes) {
			ret =  known_primes[i]
		} else {
			ret = expand_known_primes()
		}
		i += 1
		return
	}
}

type PrimeFactorList struct {
	primes, counts []int
}

func max (a, b int) int {
	if a > b {
		return a
	}
	return b
}

func (list *PrimeFactorList) append(prime, count int) {
	list.primes = append(list.primes, prime)
	list.counts = append(list.counts, count)
}

func (l1 *PrimeFactorList) merge(l2 *PrimeFactorList) *PrimeFactorList {
	i1, i2 := 0, 0
	ret := new(PrimeFactorList)
	for i1 < len(l1.primes) && i2 < len(l2.primes) {
		if l1.primes[i1] == l2.primes[i2] {
			ret.append(l1.primes[i1], max(l1.counts[i1], l2.counts[i2]))
			i1 += 1
			i2 += 1
		} else if l1.primes[i1] < l2.primes[i2] {
			ret.append(l1.primes[i1], l1.counts[i1])
			i1 += 1
		} else { // >
			ret.append(l2.primes[i2], l2.counts[i2])
			i2 += 1
		}
	}
	if i1 >= len(l1.primes) {
		for ; i2 < len(l2.primes); i2 += 1 {
			ret.append(l2.primes[i2], l2.counts[i2])
		}
	} else if i2 >= len(l2.primes) {
		for ; i1 < len(l1.primes); i1 += 1 {
			ret.append(l1.primes[i1], l1.counts[i1])
		}
	}
	return ret
}

func get_prime_factor_list (n int) *PrimeFactorList {
	ret := new(PrimeFactorList)
	p_iter := prime_iter();
	for n > 1 {
		p := p_iter ()
		count := 0
		for n % p == 0 {
			n /= p
			count += 1
		}
		if count == 0 {
			continue
		}
		ret.primes = append(ret.primes, p)
		ret.counts = append(ret.counts, count)
	}
	
	return ret
}

func (list *PrimeFactorList) prod_up () int {
	ret := 1;
	for i := 0; i < len(list.primes); i += 1 {
		for j:= 0; j < list.counts[i]; j += 1 {
			ret *= list.primes[i]
		}
	}
	return ret
}

func main (){
	init_known_primes ()

	fac_lcm := get_prime_factor_list(1)
	for i := 2; i <= 21; i += 1 {
		fac_lcm = fac_lcm.merge(get_prime_factor_list(i))
	}
	fmt.Println(fac_lcm.primes, fac_lcm.counts)
	fmt.Println(fac_lcm.prod_up())
}

