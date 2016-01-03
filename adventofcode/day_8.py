import re
import sys

minus_1_re = re.compile(r'\\[\\"]')
minus_3_re = re.compile(r'\\x[0-9a-f]{2}')

total = 0
for line in sys.stdin:
  line = line.rstrip()
  if len(line) == 0:
    break
  line = line[1:-1]
  total += 2
  print re.findall(minus_1_re, line)
  total += len(re.findall(minus_1_re, line))
  print re.findall(minus_3_re, line)
  total += 3 * len(re.findall(minus_3_re, line))
  
print total
  
