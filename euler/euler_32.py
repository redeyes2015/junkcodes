from itertools import permutations

"""
result = set()
for perm in permutations("123456789"):
	for i in xrange(1, 5):
		for j in xrange(i + 1, 7):
			a = int(''.join(perm[0:i]))
			b = int(''.join(perm[i:j]))
			if a > b:
				continue
			prod = int(''.join(perm[j:]))
			if a * b == prod:
				print a, b, prod
				result.add(prod)

print sum(result)
"""

digit = set(str(i) for i in range(10))
def no_dup(s):
	if '0' in s:
		return False
	remain = digit.copy()
	for c in s:
		if c not in remain:
			return False
		remain.remove(c)
	return True
	
s = 0
for i in xrange(1234, 9877):
	i_s = str(i)
	if not no_dup(i_s):
		continue
	for j in xrange(1, 99):
		k = i / j
		if k < j:
			break;
		if i % j != 0:
			continue
		j_s = str(j)
		k_s = str(k)
		ijk_s = i_s + j_s + k_s
		if len(ijk_s) != 9:
			continue
		if no_dup(ijk_s):
			print i, j, k
			s += i
			break
print s
		

