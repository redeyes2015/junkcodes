
def no_dup(n, mark=None):
	if mark is None:
		mark = [False for _ in range(10)]
	while n > 0:
		d = n % 10
		if d == 0 or mark[d]:
			return False
		mark[d] = True
		n /= 10
	return True

def isPanMult(n):
	mark = [False for _ in range(10)]
	t = []
	s = n
	for _ in range(10):
		if not no_dup(s, mark):
			return ""
		t.append(str(s))
		if all(mark[1:]):
			return ''.join(t)
		s += n
	return ""

max_pan = "123456789"
for i in xrange(1, 100000):
	t = isPanMult(i)
	if len(t) > 0:
		print t, i
print t
