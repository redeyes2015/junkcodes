from itertools import permutations

prime_table = [True for _ in xrange(3000)]
prime_table[0] = prime_table[1] = False
for p in xrange(3000):
	if not prime_table[p]:
		continue
	for t in xrange(p*p, 3000, p):
		prime_table[t] = False

prime_list = [p for (p, b) in enumerate(prime_table) if b]
prime_table = None

def is_prime(n):
	for p in prime_list:
		(t, m) = divmod(n, p)
		if t < p: # (n / p) < p
			break
		if m == 0:
			return False
	return True

for perm in permutations(map(str, reversed(range(1, 8)))):
	p = int("".join(perm))
	if is_prime(p):
		print p
		break
