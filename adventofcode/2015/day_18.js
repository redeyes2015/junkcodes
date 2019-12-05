'use strict';

//const input = require('fs').readFileSync('day_18.test2', {encoding: 'ascii'});
const input = require('fs').readFileSync('day_18.input', {encoding: 'ascii'});

let map1 = input.split("\n")
        .map(l => l.trim())
        .filter(l => l.length > 0)
        .map(l => l.split(""));

const x_max = map1.length - 1;
const y_max = map1[0].length - 1;

console.log('maxes', x_max, y_max)

function next(map) {
  return map.map((line, x) => {
    return line.map((c, y) => {
      let neighbor_on = 0;

      const on_x_border = (x == 0 || x == x_max)
      const on_y_border = (y == 0 || y == y_max);

      if (on_x_border && on_y_border) {
        return '#';
      }

      if (x > 0) {
        if (y > 0 && map[x - 1][y - 1] == '#') {
          neighbor_on += 1;
        }
        if (map[x - 1][y] == '#') {
          neighbor_on += 1;
        }
        if (y < y_max && map[x - 1][y + 1] == '#') {
          neighbor_on += 1;
        }
      }
      if (x < x_max) {
        if (y > 0 && map[x + 1][y - 1] == '#') {
          neighbor_on += 1;
        }
        if (map[x + 1][y] == '#') {
          neighbor_on += 1;
        }
        if (y < y_max && map[x + 1][y + 1] == '#') {
          neighbor_on += 1;
        }
      }
      if (y > 0 && map[x][y - 1] == '#') {
        neighbor_on += 1;
      }
      if (y < y_max && map[x][y + 1] == '#') {
        neighbor_on += 1;
      }

      if (neighbor_on == 3 || (c == '#' && neighbor_on == 2)) {
        return '#';
      }
      return '.';
    });
  });
}


for (let i = 0; i < 100; ++i) {
  //console.log(map1.map(l => l.join('')).join('\n'), '\n');
  map1 = next(map1);
  
}
console.log(map1.map(l => l.join('')).join('\n'));
console.log(map1.map(l => l.filter(c => c == '#').join('')).join('').length)
