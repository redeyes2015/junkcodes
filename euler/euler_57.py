def calc_digits(n):
	d = 0
	while n != 0:
		d += 1
		n /= 10
	return d

cnt = 0
num = 3
den = 2
for _ in xrange(999):
	num, den = den, num + den # 1/(prev + 1)
	num += den # += 1
	if calc_digits(num) > calc_digits(den):
		cnt += 1
		#print num, den

print '>>> ', cnt
