import re
import sys

def_re = re.compile(r"(\w+) to (\w+) = (\d+)")

theMap = {}

maxDist = 0

for line in sys.stdin:
  m = def_re.match(line.rstrip())
  if m is None:
    continue
  city1 = m.group(1)
  city2 = m.group(2)
  dist = int(m.group(3))
  if city1 not in theMap:
    theMap[city1] = {}
  if city2 not in theMap:
    theMap[city2] = {}

  theMap[city1][city2] = theMap[city2][city1] = dist
  if dist > maxDist:
    maxDist = dist
  
cities = set(theMap.keys())
#shortest = maxDist * len(cities)
longest = 0

def traverse(curDist, lastCity, leftCities):
  #global shortest
  global longest
  if len(leftCities) == 0:
    #if shortest > curDist:
      #shortest = curDist
    if longest < curDist:
      longest = curDist
    return

  for nextCity in leftCities:
    newLeftCities = leftCities.copy()
    newLeftCities.remove(nextCity)
    traverse(curDist + theMap[lastCity][nextCity],
             nextCity, newLeftCities)

for city in cities:
  newCities = cities.copy()
  newCities.remove(city)
  traverse(0, city, newCities)

#print shortest 
print longest 

  

