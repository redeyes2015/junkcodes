import hashlib

input_format = "ckczppom%d"

def check(i):
  return hashlib.md5(input_format % i).hexdigest().startswith("000000")

i = 1

while not check(i):
  i += 1

print i

