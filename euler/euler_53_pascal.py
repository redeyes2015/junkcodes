
matrix = [[1] * (n + 1) for n in range(101)]

cnt = 0
for i in xrange(1, 101):
	for j in xrange(1, i):
		matrix[i][j] = matrix[i - 1][j] + matrix[i - 1][j - 1]
		if matrix[i][j] > 1000000:
			matrix[i][j] = 1000000
			cnt += 1
print cnt
