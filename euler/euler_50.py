LIMIT = 1000000
prime_table = [True] * LIMIT
prime_table[0] = False
prime_table[1] = False

prime_list = []
for i in xrange(2, LIMIT):
	if not prime_table[i]:
		continue
	prime_list.append(i)
	for j in xrange(i*i, LIMIT, i):
		prime_table[j] = False

def get_max(prime_list):
	p_cnt = len(prime_list)
	max_l = 1
	max_i = 0
	for i, p in enumerate(prime_list):
		s = p
		for j in xrange(i + 1, p_cnt):
			s += prime_list[j]
			if s >= LIMIT:
				break
			if prime_table[s]:
				l = j - i + 1
				if l > max_l:
					max_l = l
					max_i = i
	return (max_l, max_i)

(max_l, max_i) = get_max(prime_list)

print 'max: ', sum(prime_list[max_i: max_i + max_l]), max_i, max_l
