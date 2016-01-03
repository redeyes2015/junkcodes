'use strict';

const rl = require('readline').createInterface({
  input: process.stdin,
  terminal: false
});

const template = /^(\w+): capacity (-?\d+), durability (-?\d+), flavor (-?\d+), texture (-?\d+), calories (-?\d+)\n?$/;

const ingreds = [];

rl.on('close', solve)
  .on('line', line => {
    const result = template.exec(line);
    if (result == null) {
      throw line
    }
    ingreds.push({
      name: result[1],
      capacity: parseInt(result[2], 10),
      durability: parseInt(result[3], 10),
      flavor: parseInt(result[4], 10),
      texture: parseInt(result[5], 10),
      calories: parseInt(result[6], 10)
    });
  });

function solve() {
  const ingreds_l = ingreds.length;
  
  let maxScore = 0;
  let maxList = null;

  (function makeDistribute (list, left, check) {
     if (list.length == ingreds_l - 1) {
       check(list.concat(left));
       return;
     }
    for (let i = 0; i <= left; ++i) {
      makeDistribute(list.concat(i), left - i, check);
    }
  })([], 100, list => {
    const grandCalories = ingreds.reduce((acc, ingred, idx) => (
      acc + list[idx] * ingred.calories
    ), 0);
    if (grandCalories != 500) {
      return;
    }
    const grandScore = ['capacity', 'durability', 'flavor', 'texture'].map(attr => {
      let score = 0;
      for (let i = 0; i < ingreds_l; ++i) {
        score += ingreds[i][attr] * list[i];
      }
      return Math.max(0, score);
    }).reduce((acc, score) => acc * score, 1);

    if (maxScore < grandScore) {
      maxScore = grandScore;
      maxList = list;
    }
  });

  console.log(maxScore, maxList);
}
