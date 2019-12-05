'use strict';

const rl = require('readline').createInterface({
  input: process.stdin,
  terminal: false
});

let template = /^(\w+) would (gain|lose) (\d+) happiness units by sitting next to (\w+)\.\n?$/;

let map = {};

rl.on('close', function () {
    solve();
  })
  .on('line', function (line) {
    let result = template.exec(line);
    if (result == null) {
      throw line
    }
    const p1 = result[1];
    const p2 = result[4];
    const happiness = (result[2] == 'gain' ? 1 : -1) * parseInt(result[3], 10);
    if (!map.hasOwnProperty(p1)) {
      map[p1] = {}
    }
    map[p1][p2] = happiness;
  });

function solve() {
  const names = Object.keys(map).concat("me");
  let max = Number.NEGATIVE_INFINITY;
  let max_list = void 0;

  map.me = {};
  names.forEach(name => map.me[name] = map[name].me = 0);
  

  (function traverse_perm(list, left_names, check) {
    if (left_names.length < 1) {
      check(list);
      return;
    }
    left_names.forEach((name, i) => {
      if (list.length == 0 && i == 0) {
        return;
      }
      traverse_perm(list.concat(name), left_names.filter(n => name != n), check);
    });
  })([], names, list => {
    const list_l = list.length;
    const head = list[0];
    const tail = list[list_l - 1];
    let total_happiness = map[head][tail] + map[tail][head];
    for (let i = 1; i < list_l; ++i) {
      let prev = list[i - 1];
      let next = list[i];
      total_happiness += map[prev][next] + map[next][prev];
    }
    //console.log(total_happiness, list);
    if (total_happiness > max) {
      max = total_happiness;
      max_list = list;
    }
  });
  console.log(max);
  console.log(max_list);
}
