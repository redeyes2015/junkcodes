LIMIT = 1000000
prime_table = [True] * LIMIT
prime_table[0] = False
prime_table[1] = False

#prime_list = []
for i in xrange(2, LIMIT):
	if not prime_table[i]:
		continue
	#prime_list.append(i)
	for j in xrange(i*i, LIMIT, i):
		prime_table[j] = False
