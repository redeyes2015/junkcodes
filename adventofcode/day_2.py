import sys

total = 0

for line in sys.stdin:
  nums = line.split("x")
  if len(nums) < 3:
    continue
  a = int(nums[0])
  b = int(nums[1])
  c = int(nums[2])
  area1 = a * b
  area2 = b * c
  area3 = c * a
  total += 2 * (area1 + area2 + area3)
  total += min(area1, area2, area3)

print total
