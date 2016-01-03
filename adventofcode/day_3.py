import sys

x = 0
y = 0
the_map = {}
the_map[0] = {}
the_map[0][0] = 1

input = sys.stdin.read()

for c in input:
  if c == "^":
    y += 1
  if c == "v":
    y -= 1
  if c == "<":
    x -= 1
  if c == ">":
    x += 1
  if x not in the_map:
    the_map[x] = {}
  the_map[x][y] = 1

total = 0
for ys in the_map.itervalues():
  total += len(ys.keys())

print total

