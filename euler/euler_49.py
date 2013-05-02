from itertools import permutations, combinations

LIMIT = 10000
prime_table = [True] * LIMIT
prime_table[0] = False
prime_table[1] = False

for i in xrange(2, LIMIT):
	if not prime_table[i]:
		continue
	for j in xrange(i*i, LIMIT, i):
		prime_table[j] = False

def split_digit(n):
	ret = []
	while n > 0:
		ret.append(n % 10)
		n /= 10
	return tuple(reversed(ret))

def join_digit(l):
	return reduce(lambda a, b: a*10 + b, l, 0)

check_table = list(prime_table)
for i in range(1000, 10000):
	if not check_table[i]:
		continue
	digits = split_digit(i)
	if 0 in digits:
		check_table[i] = False
		continue

	grp = set()
	for l in permutations(digits):
		n = join_digit(l)
		if not check_table[n]:
			continue
		grp.add(n)

	for l in combinations(grp, 3):
		sorted_l = sorted(l)
		if sorted_l[1] - sorted_l[0] == sorted_l[2] - sorted_l[1]:
			print "Found!!!", ", ".join(map(str, sorted_l))

	for n in grp:
		check_table[n] = False
		
