package main

import "fmt"
import "container/list"

func main () {
	factorN := make([]int, 10)
	factorN[0] = 1
	for i := 1; i < 10; i += 1 {
		factorN[i] = factorN[i-1] * i
	}
	target := 999999
	available := list.New()
	for i := 0; i < 10; i += 1 {
		available.PushBack(i)
	}
	for i := 9; i >= 0; i -= 1 {
		th := target / factorN[i]
		target %= factorN[i]

		fmt.Printf("th: %d;", th)
		for e := available.Front();
				e != nil; e = e.Next() {
			if th == 0 {
				fmt.Printf(" %d\n", e.Value.(int))
				_ = available.Remove(e)
				break;
			}
			th -= 1
		}
	}
}
