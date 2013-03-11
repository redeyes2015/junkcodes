package main

import "fmt"
import "container/list"

func prime_gen (out chan<- int64) {
	out <- int64(2)
	out <- int64(3)
	known_primes := new(list.List)
	known_primes.PushBack(int64(2))
	known_primes.PushBack(int64(3))

	for try := int64(5); ; try += int64(2) {
		try_is_prime := true

		for e:= known_primes.Front(); try_is_prime && e != nil; e = e.Next() {
			p, _ := e.Value.(int64)

			if try % p == 0 {
				try_is_prime = false
			} else if (p + p) > try {
				break
			}
		}

		if try_is_prime {
			out <- try
			known_primes.PushBack(try)
		}
	}
}

func max_prime_factor (n int64) int64 {
	left_n := n

	prime_chan := make(chan int64)
	go prime_gen(prime_chan)

	for {
		p := <- prime_chan
		if left_n % p != 0 {
			continue
		}

		for left_n % p == 0 {
			left_n /= p
		}
		if left_n == 1 {
			return p
		}
	}
	return -1
}

func main (){
	fmt.Println(max_prime_factor(600851475143))

}

