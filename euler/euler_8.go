package main

import "fmt"
import "strings"

var one_k_num string = ("73167176531330624919225119674426574742355349194934" +
	"96983520312774506326239578318016984801869478851843" +
	"85861560789112949495459501737958331952853208805511" +
	"12540698747158523863050715693290963295227443043557" +
	"66896648950445244523161731856403098711121722383113" +
	"62229893423380308135336276614282806444486645238749" +
	"30358907296290491560440772390713810515859307960866" +
	"70172427121883998797908792274921901699720888093776" +
	"65727333001053367881220235421809751254540594752243" +
	"52584907711670556013604839586446706324415722155397" +
	"53697817977846174064955149290862569321978468622482" +
	"83972241375657056057490261407972968652414535100474" +
	"82166370484403199890008895243450658541227588666881" +
	"16427171479924442928230863465674813919123162824586" +
	"17866458359124566529476545682848912883142607690042" +
	"24219022671055626321111109370544217506941658960408" +
	"07198403850962455444362981230987879927244284909188" +
	"84580156166097919133875499200524063689912560717606" +
	"05886116467109405077541002256983155200055935729725" +
	"71636269561882670428252483600823257530420752963450")

func rune2int (c rune) int {
	if c == '0' {
		return 0
	} else if c == '1' {
		return 1
	} else if c == '2' {
		return 2
	} else if c == '3' {
		return 3
	} else if c == '4' {
		return 4
	} else if c == '5' {
		return 5
	} else if c == '6' {
		return 6
	} else if c == '7' {
		return 7
	} else if c == '8' {
		return 8
	} else if c == '9' {
		return 9
	}

	panic("foooooo")
}

func runner (s string, out chan<- int) {
	if len(s) < 5 {
		out <- 0
		return
	}
	ret := 1
	dp_a := [5]int {1,1,1,1,1}
	reader := strings.NewReader(s)
	for {
		r, _, err := reader.ReadRune()
		if err != nil {
			break
		}
		newbie := rune2int(r)
		for j := 1; j < len(dp_a) ; j += 1 {
			dp_a[j - 1] = dp_a[j] * newbie
		}
		dp_a[4] = newbie
		if dp_a[0] > ret {
			ret = dp_a[0]
		}
		//fmt.Println(dp_a[0], r)
	}
	out <- ret
}

func collector(n int, in_chan <-chan int, out_chan chan<- int ) {
	ret := 0
	for ; n > 0; n -= 1 {
		t := <- in_chan
		if t > ret {
			ret = t
		}
	}
	out_chan <- ret
}

func main() {
	seq_list := strings.Split(one_k_num, "0")
	fmt.Println(len(seq_list))


	merge_chan := make(chan int)
	res_chan := make(chan int)
	
	go collector(len(seq_list), merge_chan, res_chan)

	for i := 0; i < len(seq_list); i += 1 {
		go runner(seq_list[i], merge_chan)
	}

	fmt.Println(<- res_chan)
}
