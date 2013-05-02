from itertools import count

def split_digit(n):
	ret = []
	while n > 0:
		ret.append(n % 10)
		n /= 10
	return tuple(reversed(ret))

def join_digit(l):
	return reduce(lambda a, b: a*10 + b, l, 0)

def test(n, digits):
	return sorted(split_digit(n)) == digits

for n in count(100):
	n_split = split_digit(n)
	if n_split[0] != 1:
		continue

	n_digits_sorted = sorted(n_split)
	found = True
	for t in range(2, 7):
		if not test(n * t, n_digits_sorted):
			found = False
			break
	if found:
		print ", ".join(str(n * t) for t in range(1, 7))
		break

