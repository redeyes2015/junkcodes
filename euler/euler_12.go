package main

import "fmt"
import "container/heap"

type Roller struct {
	current, prime int
}

func (r *Roller) Roll () {
	r.current += r.prime
}

type RollerQueue []*Roller

func (rq RollerQueue) Len() int {
	return len(rq)
}

func (rq RollerQueue) Less (i, j int) bool {
	return rq[i].current < rq[j].current
}

func (rq RollerQueue) Swap (i, j int) {
	rq[i], rq[j] = rq[j], rq[i]
}

func (rq *RollerQueue) Push (x interface{}) {
	*rq = append(*rq, x.(*Roller))
}

func (rq *RollerQueue) Pop() interface{} {
	a := *rq
	n := len(a) - 1
	item := a[n]
	*rq = a[0: n]
	return item
}

func (rq *RollerQueue) roll() {
	a := *rq
	if len(a) < 1 {
		return
	}
	item := heap.Pop(rq).(*Roller)
	item.Roll()
	heap.Push(rq, item)
}

func (rq RollerQueue) peak() int{
	if len(rq) < 1 {
		panic("peaking empty queue!")
	}
	return rq[0].current
}

var known_primes []int

var expand_known_primes func () int // func_ptr!

func init_known_primes () {
	known_primes = make([]int, 0, 20)
	known_primes = append(known_primes, 2, 3)

	current_candidate := 3
	next_candidate := func () int {
		current_candidate += 2

		return current_candidate
	}
	expand_known_primes = func () int {
		try := next_candidate()
		for !is_prime(try) {
			try += 2
		}
		known_primes = append(known_primes, try)
		return try
	}
}

func is_prime (n int) bool {
	for _, p := range(known_primes) {
		if (p + p) > n {
			break
		}
		if (n % p) == 0 {
			return false
		}
	}
	return true
}

func prime_iter () (func () int) {
	i := 0
	return func () (ret int){
		if i < len(known_primes) {
			ret =  known_primes[i]
		} else {
			ret = expand_known_primes()
		}
		i += 1
		return
	}
}

func get_factor_count (n int) int{
	p_iter := prime_iter()
	count := 1
	for n != 1 {
		p := p_iter()
		times := 0
		for n % p == 0 {
			n /= p
			times += 1
		}
		count *= (times + 1)
	}
	return count
}

func main (){
	init_known_primes ()

	max_trian, max_i, max_factors := 1, 1, 1

	for i, trian := 1, 0; i <= 50000; i += 1 {
		trian += i
		factors := get_factor_count(trian)
		if factors > 500 {
			max_i = i
			max_trian = trian
			max_factors = factors
			break
		}
	}
	fmt.Println(max_i, max_trian, max_factors, len(known_primes))
}

