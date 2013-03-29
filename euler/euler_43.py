from itertools import permutations

s = 0
for digits in permutations(range(10)):
	if digits[0] == 0:
		continue
	if digits[3] & 1 == 1:
		continue
	if (digits[2] + digits[3] + digits[4]) % 3 != 0:
		continue
	if (digits[5] != 5 and digits[5] != 0):
		continue
	if (2 * digits[4] + 3 * digits[5] + digits[6]) % 7 != 0:
		continue
	if (digits[5] - digits[6] + digits[7]) % 11 != 0:
		continue
	if (9 * digits[6] + 10 * digits[7] + digits[8]) % 13 != 0:
		continue
	if (15 * digits[7] + 10 * digits[8] + digits[9]) % 17 != 0:
		continue

	t = reduce(lambda t,x: t*10+x, digits)
	s += t
	print t

print "----"
print s

