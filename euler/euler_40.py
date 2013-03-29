
def get_digit_foo(n):
	counted = 0
	digit = 1
	bond = 10
	i = 1
	while True:
		if i >= bond:
			digit += 1
			bond *= 10
		if counted + digit >= n:
			break
		counted += digit
		i += 1

	digits = []
	while i > 0:
		digits.append(i % 10)
		i /= 10
	return tuple(reversed(digits))[n - counted - 1]

print reduce(lambda x, y: x * y, (get_digit_foo(i) for i in [1, 10, 100, 1000, 10000, 100000, 1000000]))
