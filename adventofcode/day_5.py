import  sys
import re

bad_word = re.compile("ab|cd|pq|xy")
double_re = re.compile("(.)\\1")
aeiou_re = re.compile("[aeiou].*[aeiou].*[aeiou]")
count = 0

for line in sys.stdin:
  if bad_word.search(line) is not None:
  #if any(w in line for w in ("ab", "cd", "pq", "xy")):
    continue
  if double_re.search(line) is None:
    continue
  if aeiou_re.search(line) is None:
    continue
  count += 1

print count
  
