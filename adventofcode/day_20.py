
INPUT = 36000000

plateSize = 10000000

plate = list(range(plateSize))

plate[0] = plate[1] = False
for i in xrange(2, plateSize):
  plate[i] = True

primes = []

for i in xrange (2, plateSize):
  if not plate[i]:
    continue

  primes.append(i)

  for j in xrange(i + i, plateSize, i):
    plate[j] = False

print primes[0:10]

def getFactorsSum (n):
  originN = n
  total = 1

  for p in primes:
    if p > n:
      break

    subTotal = 1
    primeProduct = p

    while (n % p) == 0:
      n /= p
      subTotal += primeProduct
      primeProduct *= p

    total *= subTotal
    if n == 1:
      break

  if n > 1:
    raise Exception(originN)

  return total

watchPoint = 10000
for i in xrange(1000, plateSize):
  if i % watchPoint == 0:
    print i

  if getFactorsSum(i) * 10 >= INPUT:
    print i
    break
