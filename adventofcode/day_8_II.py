import re
import sys

total = 0

for line in sys.stdin:
  line = line.rstrip()
  if len(line) == 0:
    break
  total += 2
  total += len(re.findall(r'[\\"]', line))
  
print total
  
