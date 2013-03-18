package main

import (
		"fmt"
		"strings"
	   )

var input []string = []string {
	"75",
	"95 64",
	"17 47 82",
	"18 35 87 10",
	"20 04 82 47 65",
	"19 01 23 75 03 34",
	"88 02 77 73 07 63 67",
	"99 65 04 28 06 16 70 92",
	"41 41 26 56 83 40 80 70 33",
	"41 48 72 33 47 32 37 16 94 29",
	"53 71 44 65 25 43 91 52 97 51 14",
	"70 11 33 28 77 73 17 78 39 68 17 57",
	"91 71 52 38 17 14 91 43 58 50 27 29 48",
	"63 66 04 68 89 53 67 30 73 16 69 87 40 31",
	"04 62 98 27 23 09 70 98 73 93 38 53 60 04 23",
}

func main () {
	cost_matrix := make([][]int, len(input))
	for i, row_s := range input {
		row_s_a := strings.Split(row_s, " ")
		row := make([]int, len(row_s_a))
		for j, cost_s := range row_s_a {
			_, _ = fmt.Sscanf(cost_s, "%d", &row[j])
		}
		cost_matrix[i] = row
	}
	dp_matrix := make([][]int, len(input))
	dp_matrix[0] = cost_matrix[0]

	for i := 1; i < len(cost_matrix); i += 1 {
		cost_row := cost_matrix[i]
		last_dp_row := dp_matrix[i - 1]

		count := len(cost_row)
		dp_row := make([]int, count)
		dp_matrix[i] = dp_row

		dp_row[0] = last_dp_row[0] + cost_row[0]
		dp_row[count - 1] = last_dp_row[count - 2] + cost_row[count - 1]

		for j := count - 2; j > 0; j -= 1 {
			if c1, c2 := last_dp_row[j], last_dp_row[j -1]; c1 > c2 {
				dp_row[j] = cost_row[j] + c1
			} else {
				dp_row[j] = cost_row[j] + c2
			}
		}
		//fmt.Println(dp_row)
	}
	
	res := 0
	for _, v := range dp_matrix[len(dp_matrix) - 1] {
		if v > res {
			res = v
		}
	}
	fmt.Println(res)
}
