import math

log_table = [0] * 101
for i in range(1, 101):
	log_table[i] = math.log10(i)

def calc_c(n, r):
	s = 0
	for i in xrange(2, n + 1):
		s += log_table[i]
	for i in xrange(2, r + 1):
		s -= log_table[i]
	for i in xrange(2, n - r + 1):
		s -= log_table[i]
	return s

cnt = 0
for n in xrange(1, 101):
	for r in xrange(1, n-1):
		if calc_c(n, r) > 6:
			cnt += 1

print cnt

