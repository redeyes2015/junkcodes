#!/usr/bin/env python

import sys
from itertools import izip, repeat, product

input_pan = [
    [ 0, 0, 9,  4, 0, 0,  0, 0, 2],
    [ 0, 0, 0,  0, 6, 0,  0, 0, 9],
    [ 0, 0, 2,  7, 0, 0,  8, 0, 0],

    [ 0, 0, 6,  0, 0, 0,  0, 1 ,8],
    [ 5, 0, 0,  1, 0, 3,  0, 0, 6],
    [ 9, 4, 0,  0, 0, 0,  7, 0, 0],

    [ 0, 0, 5,  0, 0, 8,  3, 0, 0],
    [ 7, 0, 0,  0, 3, 0,  0, 0, 0],
    [ 2, 0, 0,  0, 0, 7,  5, 0, 0]
]

init_pan = [
	[ [input_cell] if input_cell != 0 else list(range(1, 10))
		for input_cell in input_row ]
			for input_row in input_pan
]

class WrongPanException(Exception):
	pass

def isCompleted(pan):
	return all([ len(pan[r][c]) == 1
		for r, c in product(range(9), range(9))])

def dupe_pan(pan):
	return [ [ [ val for val in cell ]
		 for cell in row ]
			for row in pan ]

def gen_pan_id(pan):
	pan_id = ''
	for row in pan:
		pan_id += ''.join(map(str, [
			cell[0] if len(cell) == 1 else 0
				for cell in row]))
	return pan_id

def output_pan(pan):
	print ''
	for row in pan:
		print ( ' '.join(map(str, [
			cell[0] if len(cell) == 1 else 0
				for cell in row])))

output_pan(init_pan)
print "inited", 

groups = []
for r in range(9):
	groups.append(tuple(izip(repeat(r), range(9))))
for c in range(9):
	groups.append(tuple(izip(range(9), repeat(c))))

for r_anchor, c_anchor in product(range(0, 9, 3), range(0, 9, 3)):
	groups.append(tuple([(r_anchor + r_off, c_anchor + c_off)
		for r_off, c_off in product(range(3), range(3))]))

group_mapping = []
for r in range(9):
	row_mapping = []
	for c in range(9):
		row_mapping.append([])
	group_mapping.append(row_mapping)

for group in groups:
	for r, c in group:
		group_mapping[r][c].append(group)

def crossing_out(pan, r, c):
	something_out = False
	x_out = pan[r][c][0]
	for group in group_mapping[r][c]:
		for rel_r, rel_c in group:
			if rel_r == r and rel_c == c:
				continue
			rel_cell = pan[rel_r][rel_c]
			if len(rel_cell) == 1:
				if x_out == rel_cell[0]:
					raise WrongPanException(
						r, c, rel_r, rel_c);
				else:
					continue
			try:
				rel_cell.remove(x_out)
				something_out = True
			except ValueError:
				pass
	return something_out

def crossing(init_pan):
	something_out = False
	for r, c in product(range(9), range(9)):
		if len(init_pan[r][c]) > 1:
			continue
		if crossing_out(init_pan, r, c):
			something_out = True
	return something_out

def putting(pan):
	anything_put = False
	for group in groups:
		filled_map = dict.fromkeys(range(1, 10), False)
		suspect_map_rc = [ [] for i in range(10) ]
		for r, c in group:
			cell = pan[r][c]
			if len(cell) == 1:
				filled_map[cell[0]] = True
			else:
				for val in cell:
					suspect_map_rc[val].append((r,c))

		for try_fill, filled in filled_map.iteritems():
			if filled:
				continue
			suspects = suspect_map_rc[try_fill]
			suspect_num = len(suspects)
			if suspect_num == 0:
				raise WrongPanException('boooo')
			elif suspect_num == 1:
				r, c = suspects[0]
				pan[r][c] = [try_fill]
				anything_put = True
	return anything_put

def getLeastPossibility(pan):
	target = (0, 0)
	target_val = 10
	for r, c in product(range(9), range(9)):
		possibility = len(pan[r][c])
		if (possibility == 1 or possibility > target_val):
			continue
		target = (r, c)
		target_val = possibility
	return target_val

solved = set()
def solve_pan(pan, level, visited_node):
	while(putting(pan) or crossing(pan)):
		pass

	if isCompleted(pan):
		pan_id = gen_pan_id(pan)
		if pan_id not in solved:
			solved.add(pan_id)
			output_pan(pan)
			print 'good!'
		return True

	pan_id = gen_pan_id(pan)
	if pan_id in visited_node:
		return
	visited_node.add(pan_id)

	target_level = getLeastPossibility(pan)
	for (r, c) in product(range(9), range(9)):
		cell = pan[r][c]
		if target_level != len(cell):
			continue
		for guess in cell:
			new_pan = dupe_pan(pan)
			new_pan[r][c] = [guess]

			pan_id = gen_pan_id(new_pan)
			if pan_id in visited_node:
				continue
			visited_node.add(pan_id)

			try:
				solve_pan(new_pan, level + 1, visited_node)
			except WrongPanException:
				continue
		break

solve_pan(init_pan, 0, set())
