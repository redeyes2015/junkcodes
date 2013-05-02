LIMIT = 1000000

def make_table(n):
	fact_table = [0] * n
	for i in xrange(2, LIMIT):
		if fact_table[i] != 0:
			continue
		for n in xrange(i + i, LIMIT, i):
			fact_table[n] += 1
	return fact_table

fact_table = make_table(LIMIT)

fact_table[0] = fact_table[1] = -1

def make_prime_list(fact_table):
	prime_list = []
	for n, c in enumerate(fact_table):
		if c == 0:
			prime_list.append(n)
	return prime_list

prime_list = make_prime_list(fact_table)

def fact_dump(n):
	l = []
	t = n
	for p in prime_list:
		count = 0
		while t % p == 0:
			count += 1
			t /= p
		if count > 0:
			l.append((p, count))
	return n, "=", " x ".join("%d^%d" % (t[0], t[1]) for t in l)

stripe = 0;
for n in xrange(2*3*5*7, LIMIT):
	if n % 100 == 0:
		print "Progress...", n
	if fact_table[n] != 4:
		stripe = 0
		continue
	stripe += 1
	if stripe == 4:
		print "Found!!!", n - 3
		print fact_dump(n-3)
		print fact_dump(n-2)
		print fact_dump(n-1)
		print fact_dump(n)
		break

