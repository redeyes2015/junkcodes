package main

import "fmt"

var known_primes []int

func init_known_primes () {
	known_primes = make([]int, 0, 1000)
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
	if len(known_primes) % 1000 == 0 {
		fmt.Print("=")
	}
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

func main (){
	init_known_primes ()

	p_iter := prime_iter()
	sum := 0

	for {
		p := p_iter()
		if p > 2000000 {
			break
		}
		sum += p
	}
	fmt.Println(sum)
}

