import sys

total = 0

for line in sys.stdin:
  nums = line.split("x")
  if len(nums) < 3:
    continue
  a = int(nums[0])
  b = int(nums[1])
  c = int(nums[2])
  the_max = max(a, b, c)
  perimeter_sum = a + b + c
  total += a * b * c + 2 * (perimeter_sum - the_max)

print total
