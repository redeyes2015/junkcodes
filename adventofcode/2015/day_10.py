
def elf_say(s):
  curC = s[0]
  curL = 1
  Poped = []
  for c in s[1:]:
    if curC != c:
      Poped.append(tuple((curC, curL)))
      curC = c
      curL = 1
    else:
      curL += 1
  Poped.append(tuple((curC, curL)))
  return reduce(lambda s, t: "%s%d%s" % (s, t[1], t[0]), Poped, "")

s = "3113322113"
for i in range(40):
  s = elf_say(s)
  print i, ":", len(s)

print len(s)
 
