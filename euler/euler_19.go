package main

import "fmt"

type SimpleDate struct{
	year, month int
}

var firstDay2Weekday map[SimpleDate]int

func (sd SimpleDate) isLeapYear ()bool {
	y := sd.year
	switch {
	case y % 400 == 0: return true
	case y % 100 == 0: return false
	case y % 4 == 0: return true
	default: return false
	}
	panic ("baarrrrr")
}

func (sd SimpleDate) getDayCount () int {
	switch sd.month {
	default: return 31
	case 4, 6, 9, 11: return 30
	case 2:
		if sd.isLeapYear() {
			return 29
		} else {
			return 28
		}
	}
	panic ("foooo")
}

func (sd SimpleDate) getPrevMonth () SimpleDate {
	if sd.month == 1 {
		return SimpleDate{sd.year - 1, 12}
	}
	return SimpleDate{sd.year, sd.month - 1}
}

func (sd SimpleDate) getWeekday () int {
	if v, known := firstDay2Weekday[sd] ; known {
		return v
	}
	prev := sd.getPrevMonth()
	v := (prev.getWeekday() + prev.getDayCount()) % 7
	firstDay2Weekday[sd] = v
	return v
}

func main () {
	firstDay2Weekday  = make(map[SimpleDate]int)
	firstDay2Weekday[SimpleDate{1900, 1}] = 1

	count := 0
	sd := SimpleDate{0, 0}
	for y := 1901; y < 2001; y += 1 {
		sd.year = y
		for m := 1; m <= 12; m += 1 {
			sd.month = m
			if sd.getWeekday() == 0 {
				count += 1
			}
		}
	}
	fmt.Println(count)
}
