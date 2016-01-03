import re
import sys

format_re = re.compile("(toggle|turn off|turn on) " +
  "(\\d+),(\\d+) through (\\d+),(\\d+)")

the_map = []

for i in range(1000):
  the_map.append([])
  for j in range(1000):
    the_map[i].append(0)

for line in sys.stdin:
  line = line.rstrip();
  m = format_re.match(line)
  if m is None:
    continue
  action = m.group(1)
  x1 = int(m.group(2))
  y1 = int(m.group(3))
  x2 = int(m.group(4))
  y2 = int(m.group(5))
  for i in range(x1, x2 + 1):
    for j in range(y1, y2 + 1):
      if action == "turn on":
        the_map[i][j] += 1
      elif action == "turn off":
        the_map[i][j] -= 1
      elif action == "toggle":
        the_map[i][j] += 2
      if the_map[i][j] < 0:
        the_map[i][j] = 0

total = 0;
for row in the_map:
  for light in row:
    total += light

print total
