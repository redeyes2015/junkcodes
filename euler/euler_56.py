
def digital_sum(n):
	s = 0
	while n != 0:
		s += (n % 10)
		n /= 10
	return s

print max(digital_sum(a ** b) for a in xrange(1, 100) for b in xrange(1, 100))
