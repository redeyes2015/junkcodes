from itertools import count, imap
from math import sqrt

prime_list = [2, 3, 5, 7]
def is_prime(n):
	for p in prime_list:
		if n % p == 0:
			return False
		if p + p > n:
			break
	return True

foo = lambda x, p: sqrt((x - p) / 2).is_integer()

for n in imap(lambda i: 2*i + 1, count(4)):
	if is_prime(n):
		prime_list.append(n)
		continue
	if not any(foo(n, p) for p in prime_list):
		print n
		break
