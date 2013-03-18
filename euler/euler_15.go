package main

import "fmt"

func main () {
	const SIZE = 20
	prev := make([]int64, (SIZE + 1))
	curr := make([]int64, (SIZE + 1))
	for i,_ := range curr {
		curr[i] = int64(1)
	}

	for i:=1; i<=SIZE; i += 1 {
		prev, curr = curr, prev
		curr[0] = int64(1)
		for i:=1; i<=SIZE; i+=1 {
			curr[i] = curr[i-1] + prev[i]
		}
	}
	fmt.Println(curr[SIZE])
}
