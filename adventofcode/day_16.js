'use strict';

const rl = require('readline').createInterface({
  input: process.stdin,
  terminal: false
});

const hint = {
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3,
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1
};

const template = /^Sue (\d+): (\w+): (\d+), (\w+): (\d+), (\w+): (\d+)\n?$/;

rl.on('close', () => {})
  .on('line', line => {
    const result = template.exec(line);
    if (result == null) {
      throw line;
    }
    for (let i = 2; i < 8; i += 2) {
      const hint_name = result[i];
      const hint_value = parseInt(result[i + 1], 10);
      if (hint[hint_name] != hint_value) {
        return;
      }
    }
    console.log("Sue", result[1]);
  });

