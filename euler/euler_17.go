package main

import "fmt"

var one_digit []string = []string{
	"zero",
	"one", "two", "three", "four", "five",
	"six", "seven", "eight", "nine",
}

var teens []string = []string{
	"ten",
	"eleven", "twelve", "thirteen", "fourteen", "fifteen",
	"sixteen", "seventeen", "eighteen", "nineteen",
}

var tens []string = []string{
	"",
	"ten", "twenty", "thirty", "forty", "fifty",
	"sixty", "seventy", "eighty", "ninety",
}

func getCardinal(n int) string {
	switch {
	case n < 10: return one_digit[n]
	case n < 20: return teens[n - 10]
	case n < 100:
		if m := (n % 10); m != 0 {
			return tens[n / 10] + "-" + one_digit[m]
		} else {
			return tens[n / 10]
		}
	case n < 1000:
		res := one_digit[n / 100] + " " + "hundred" 
		if m := n % 100; m != 0 {
			res += " and " + getCardinal(m)
		}
		return res
	case n == 1000: return "one thousand"
	}
	return ""
}

func alphaCount(s string) int {
	ret := 0
	for _, r := range []rune(s) {
		switch r {
		case ' ':
		case '-':
		default :
			ret += 1
		}
	}
	return ret
}

func main () {
	sum := 0
	for i := 1; i <= 1000; i += 1 {
		sum += alphaCount(getCardinal(i))
	}
	fmt.Println(sum)
	/*
	fmt.Println(getCardinal(1))
	fmt.Println(getCardinal(11))
	fmt.Println(getCardinal(40))
	fmt.Println(getCardinal(101))
	fmt.Println(getCardinal(111))
	fmt.Println(getCardinal(140))
	fmt.Println(getCardinal(400))
	fmt.Println(getCardinal(1000))
	*/
}
