package main

import "fmt"
import "math"

func main (){
	sieve_tab := make([]bool, 2000000)

	for i := 2; i < len(sieve_tab); i += 1 {
		sieve_tab[i] = true
	}

	sum := int64(0)
	upper_bound := int(math.Ceil(math.Sqrt(float64(len(sieve_tab)))))

	for i := 2; i < len(sieve_tab); i += 1 {
		if !sieve_tab[i] {
			continue
		}
		sum += int64(i)

		if i > upper_bound {
			continue
		}

		for n := i * i; n < len(sieve_tab); n += i {
			sieve_tab[n] = false
		}
	}
	fmt.Println(sum)
}

