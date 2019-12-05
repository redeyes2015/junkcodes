import re
import sys

imm_re = re.compile("^\\d+$")
rename_re = re.compile("^\\w+$")
binary_op_tmpl = "(\\w+) %s (\\w+)"
and_re = re.compile(binary_op_tmpl % "AND")
or_re = re.compile(binary_op_tmpl % "OR")
shift_op_tmpl = "(\\w+) %sSHIFT (\\d+)"
lshift_re = re.compile(shift_op_tmpl % "L")
rshift_re = re.compile(shift_op_tmpl % "R")
not_re = re.compile("NOT (\\w+)")

all_name = {}

def get_value(s):
  if imm_re.match(s) is not None:
    return int(s)
  return all_name[s].evaluate()

class Node:
  def __init__(self, name, express):
    self.name = name
    self.express = express
    self.evaluated = False
    self.value = 0

  def __try_imm(self):
    if self.evaluated:
      return True
    m = imm_re.match(self.express)
    if m is not None:
      self.value = int(self.express)
      self.evaluated = True
    return self.evaluated

  def __try_not(self):
    if self.evaluated:
      return True
    m = not_re.match(self.express)
    if m is not None:
      self.value = 65535 & (
        ~ get_value(m.group(1)))
      self.evaluated = True
    return self.evaluate

  def __try_and(self):
    if self.evaluated:
      return True

    m = and_re.match(self.express)
    if m is not None:
      self.value = 65535 & (
        get_value(m.group(1)) &
        get_value(m.group(2)))
      self.evaluated = True
    return self.evaluated

  def __try_or(self):
    if self.evaluated:
      return True

    m = or_re.match(self.express)
    if m is not None:
      self.value = 65535 & (
        get_value(m.group(1)) |
        get_value(m.group(2)))
      self.evaluated = True
    return self.evaluated

  def __try_rshift(self):
    if self.evaluated:
      return True

    m = rshift_re.match(self.express)
    if m is not None:
      self.value = 65535 & (
        get_value(m.group(1)) >>
        get_value(m.group(2)))
      self.evaluated = True
    return self.evaluated

  def __try_lshift(self):
    if self.evaluated:
      return True

    m = lshift_re.match(self.express)
    if m is not None:
      self.value = 65535 & (
        get_value(m.group(1)) <<
        get_value(m.group(2)))
      self.evaluated = True
    return self.evaluated

  def __try_rename(self):
    if self.evaluated:
     return True
    m = rename_re.match(self.express)
    if m is not None:
      self.value = get_value(self.express)
      self.evaluated = True
    return self.evaluated

  def evaluate(self):
    if self.evaluated:
      return self.value
    self.__try_imm()
    self.__try_rename()
    self.__try_and()
    self.__try_or()
    self.__try_lshift()
    self.__try_rshift()
    self.__try_not()

    if not self.evaluated:
      raise Exception("can't evaluate %s: %s" % (self.name, self.express))
    return self.value


get_name_re = re.compile("(.+) -> (\\w+)\n?")
for line in sys.stdin:
  m = get_name_re.match(line)
  if m is None:
    continue
  name = m.group(2)
  express = m.group(1)
  all_name[name] = Node(name, express)

print "%s : %d" % ("a", all_name["a"].evaluate())
  
   


