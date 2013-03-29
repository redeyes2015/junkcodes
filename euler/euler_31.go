package main

import "fmt"

func poss(coins []int, target int) int{
	this_coin := coins[0]
	if len(coins) == 1 {
		if target % this_coin != 0 {
			panic("impossible!")
		}
		return 1
	}
	ret := 0
	tail := coins[1:]
	for remain := (target % this_coin); remain <= target; remain += this_coin {
		if remain == 0 {
			ret += 1
			continue
		}

		ret += poss(tail, remain)
	}
	return ret
}

func main () {
	coins := []int{200, 100, 50, 20, 10, 5, 2, 1}
	
	fmt.Println(poss(coins, 200))
}
