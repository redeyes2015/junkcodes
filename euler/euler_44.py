from itertools import count, imap
from math import sqrt

penta = lambda n: n*(3*n - 1) / 2

is_penta = lambda x: ((sqrt(24 * x + 1) + 1.0) / 6.0).is_integer()

for i in count(1):
	Ps = penta(i)
	for j in xrange(1, i):
		Pd = penta(j)
		Pk = (Ps + Pd) / 2
		if not is_penta(Pk):
			continue
		Pj = (Ps - Pd) / 2
		if not is_penta(Pj):
			continue
		print "Found..!!", Pk, Pj, Pd
		print ">>> ", i, j
	if i % 100 == 0:
		print 'progres... ', i


