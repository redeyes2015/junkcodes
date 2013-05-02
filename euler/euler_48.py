
ten_power_ten = pow(10, 10)

s = 0
for i in range(1, 1001):
	s = (s + pow(i, i, ten_power_ten)) % ten_power_ten

print s

