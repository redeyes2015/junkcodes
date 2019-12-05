import  sys
import re

two_letter = re.compile("(..).*\\1")
one_letter = re.compile("(.).\\1")

count = 0

for line in sys.stdin:
  if (two_letter.search(line) is not None and
      one_letter.search(line) is not None):
    count += 1

print count
  
