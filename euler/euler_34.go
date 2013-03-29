package main

import "fmt"

func main(){
	factors := make([]int, 10)
	for s, i:= 1, 1; i < 10; i += 1{
		s *= i
		factors[i] = s
	}
	factors[0] = 1
	bond := 10
	for i := 1; bond < i * factors[9]; i += 1 {
		//fmt.Println(bond, i, i * factors[9])
		bond *= 10
	}
	for i := bond - 1; i > 3; i -= 1 {
		s := 0
		for t:= i; t > 0; t /= 10 {
			s += factors[t % 10]
		}
		if s == i {
			fmt.Println(s)
		}
	}

}
