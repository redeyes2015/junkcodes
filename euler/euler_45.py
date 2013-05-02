from itertools import count, imap
from math import sqrt

is_penta = lambda x: ((sqrt(24 * x + 1) + 1.0) / 6.0).is_integer()
is_hexag = lambda x: ((sqrt(8 * x + 1) + 1.0) / 4.0).is_integer()

triang = lambda n: n*(n + 1)/2

for x in imap(triang, count(286)):
	if not is_penta(x):
		continue
	if not is_hexag(x):
		continue
	print "Found!!!", x
