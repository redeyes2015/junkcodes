import sys

santa_pos = [0, 0]
robo_pos = [0, 0]
the_map = {}
the_map[0] = {}
the_map[0][0] = 1

input = sys.stdin.read()
even_odd = True

for c in input:
  pos = santa_pos if even_odd else robo_pos
  even_odd = not even_odd

  if c == "^":
    pos[1] += 1
  if c == "v":
    pos[1] -= 1
  if c == "<":
    pos[0] -= 1
  if c == ">":
    pos[0] += 1
  if pos[0] not in the_map:
    the_map[pos[0]] = {}
  the_map[pos[0]][pos[1]] = 1

total = 0
for ys in the_map.itervalues():
  total += len(ys.keys())

print total

