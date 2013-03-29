package main

import "fmt"

func main () {
	pow5 := make([]int , 10)
	for i, _ := range(pow5) {
		pow5[i] = i * i * i * i * i
	}
	bond_digit := 2
	for t := 100; bond_digit * pow5[9] > t; t *= 10 {
		bond_digit += 1
	}
	fmt.Println("bond: ", bond_digit)
	sum := 0
	for n := bond_digit * pow5[9]; n > 10; n -= 1{
		c := 0
		for t := n; t > 0; t /= 10 {
			c += pow5[t % 10]
		}
		if n == c {
			fmt.Println(n)
			sum += n
		}
	}
	fmt.Println("-------")
	fmt.Println(sum)
}
