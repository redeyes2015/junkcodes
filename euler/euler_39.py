# credit goes to rayfil

max_poss = 0
max_poss_p = -1

for p in xrange(1, 1001):
	poss = 0
	for a in xrange(1, p):
		n = p * (p - 2*a)
		d = 2 * (p - a)
		if a >= (n / d):
			break
		if n % d == 0:
			poss += 1
	if max_poss < poss:
		max_poss = poss
		max_poss_p = p

print max_poss_p, max_poss
