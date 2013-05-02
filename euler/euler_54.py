value_map = {
		'2': 0,
		'3': 1,
		'4': 2,
		'5': 3,
		'6': 4,
		'7': 5,
		'8': 6,
		'9': 7,
		'T': 8,
		'J': 9,
		'Q': 10,
		'K': 11,
		'A': 12}

rank_map = {
		'one': 0,
		'one-pair': 1,
		'two-pair': 2,
		'three': 3,
		'straight': 4,
		'flush': 5,
		'full-house': 6,
		'four': 7,
		'straight-flush': 8,
		'royal-flush': 9}

def calc_rank(hands):
	is_flush = all(h[1] == hands[0][1] for h in hands)
	values = sorted(value_map[h[0]] for h in hands)
	count_table = [[] for i in range(5)]
	stripe = 1
	for i, v in enumerate(values):
		if i >= 4 or v != values[i + 1]:
			count_table[stripe].append(v)
			stripe = 1
		else:
			stripe += 1
	if len(count_table[4]) > 0:
		return ('four', count_table[4][0])
	if len(count_table[3]) > 0:
		if len(count_table[2]) > 0:
			return ('full-house', count_table[3][0])
		return ('three', count_table[3][0])
	if len(count_table[2]) == 2:
		return ('two-pair', count_table[2][1])
	if len(count_table[2]) == 1:
		return ('one-pair', count_table[2][0])
	if all(values[i] == values[i-1] + 1 for i in range(1,5)):
		if is_flush and values[4] == 12:
			return ('royal-flush', None)
		if is_flush:
			return ('straight-flush', values[4])
		return ('straight', values[4])
	if is_flush:
		return ('flush', values[4])
	return ('one', values[4])

#print calc_rank('3D 6D 7D TD QD'.split(' '))
#print calc_rank('3C 3D 3S 9S 9D'.split(' '))
#exit()

def fight(p1, p2):
	r1, v1 = calc_rank(p1)
	r2, v2 = calc_rank(p2)
	r1 = rank_map[r1]
	r2 = rank_map[r2]
	if r1 > r2:
		return 1
	if r2 > r1:
		return -1
	if v1 > v2:
		return 1
	if v2 > v1:
		return -1
	v1 = sorted((value_map[h[0]] for h in p1), reverse=True)
	v2 = sorted((value_map[h[0]] for h in p2), reverse=True)
	for i in range(5):
		if v1[i] > v2[i]:
			return 1
		if v2[i] > v1[i]:
			return -1
	print 'bow', p1, p2
	return 0

p1win_cnt = 0
with open('poker.txt') as f:
	for l in f:
		hands = l.strip().split(' ')
		try:
			if 1 == fight(hands[:5], hands[5:]):
				p1win_cnt += 1
		except:
			print hands
			break
		
print p1win_cnt

