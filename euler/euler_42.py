
words = open("words.txt").read().split(',')

words = [w.strip('"') for w in words]

ord_base = ord('A') - 1
def w2n(w):
	ret = 0
	for c in w:
		ret += ord(c) - ord_base
	return ret

traing = [n * (n + 1) / 2 for n in range(100)]

count = 0
for w in words:
	n = w2n(w)
	if n in traing:
		count += 1
print count

