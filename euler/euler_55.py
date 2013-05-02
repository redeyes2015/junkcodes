
def reverse_n(n):
	r = 0
	while n != 0:
		r = r * 10 + (n % 10)
		n /= 10
	return r

def split_digits_r(n):
	dig = []
	while n != 0:
		dig.append(n % 10)
		n /= 10
	return dig

def is_palindrome_digits(digits):
	l = len(digits)
	l_1 = l - 1
	for i in range(l / 2):
		if digits[i] != digits[l_1 - i]:
			return False
	return True

def is_lynchrel(n):
	for _ in xrange(51):
		next_n = n + reverse_n(n)
		next_n_digits = split_digits_r(next_n)
		if is_palindrome_digits(next_n_digits):
			return 0
		n = next_n
	return 1

print sum(is_lynchrel(n) for n in xrange(1, 10000))



