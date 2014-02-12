package main

import "fmt"

type heapElement interface {
	lessThan(e2 heapElement) bool
}

type myElement struct {
	value int
}

func (e1 myElement) lessThan (e2 heapElement) bool {
	ee2 := (e2).(*myElement)
	return e1.value < ee2.value
}

func foo () heapElement {
	ret := new (myElement)
	ret.value = 1
	return heapElement(ret)
}
func bar () heapElement {
	ret := new (myElement)
	ret.value = 2
	return ret
}

type myHeap struct {
	values []heapElement
}


func (h *myHeap) Insert (e heapElement) {
	h.values = append(h.values, e)
	for i := len(h.values) - 1; i > 0; i /= 2 {
		parent := (i - 1) / 2
		if !h.values[i].lessThan(h.values[parent]) {
			break
		}
		h.values[i], h.values[parent] =
			h.values[parent], h.values[i]
	}
}

func (h myHeap) getHighest () heapElement{
	return h.values[0]
}

func (h myHeap) replaceHighest (new_e heapElement) {
	h.values[0] = new_e
	i := 0
	for (i + i) < len(h.values) {
		parent := h.values[i]
		child_i := i * 2 + 1
		child := h.values[child_i]
		if !parent.lessThan(child) {
			h.values[i], h.values[child_i] =
				h.values[child_i], h.values[i]
			i = child_i
			continue
		}
		child_i = i * 2 + 2
		child = h.values[child_i]
		if !parent.lessThan(child) {
			h.values[i], h.values[child_i] =
				h.values[child_i], h.values[i]
			i = child_i
			continue
		}

		break
	}
}

func main (){
	el := new(myHeap)
	el.values = make([]heapElement, 2)
	fmt.Println("hello~")
	el.values[0] = foo().(*myElement)
	el.values[1] = bar()
	fmt.Println(el.values[0].lessThan(el.values[1]))
}
