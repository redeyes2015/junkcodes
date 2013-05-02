LIMIT = 1000000
prime_table = [True for _ in xrange(LIMIT)]
prime_table[0] = False
prime_table[1] = False

for i in xrange(2, LIMIT):
	if not prime_table[i]:
		continue
	for j in xrange(i*i, LIMIT, i):
		prime_table[j] = False

prime_list = []
for p, t in enumerate(prime_table):
	if not t:
		continue
	prime_list.append(p)

def p_count(n):
	cnt = 0
	for p in prime_list:
		is_fac = False
		while n % p == 0:
			is_fac = True
			n /= p
		if is_fac:
			cnt += 1
		if n == 1:
			break
	return cnt

def fact_dump(n):
	l = []
	for p in prime_list:
		count = 0
		while n % p == 0:
			count += 1
			n /= p
		if count > 0:
			l.append((p, count))
	print n, "=", "x".join(l)

stripe = 0
for n in xrange(2*3*5*7, LIMIT):
	if p_count(n) != 4:
		stripe = 0
		continue
	else:
		stripe += 1
		if stripe == 4:
			print "Found!!!", n - 3
			print fact_dump(n-3)
			print fact_dump(n-2)
			print fact_dump(n-1)
			print fact_dump(n)
			break
	if n % 100 == 0:
		print "Progress...", n


