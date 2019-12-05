'use strict';

const inputFile = 'day_19.input';

const input = require('fs').readFileSync(inputFile, {encoding: 'ascii'});

const inputParts = input.split('\n\n');

const formatRE = /^(\w+) => (\w+)$/;

const transforms = inputParts[0];

const initial = inputParts[1].trim();

const tested = {};

transforms.split('\n').map(line => {
    const result = formatRE.exec(line);
    if (result == null) {
      throw line;
    }
    const from = result[1];
    const from_l = from.length;
    const to = result[2];
    
    let lastSeen = -1;
    while (true) {
      lastSeen = initial.indexOf(from, lastSeen + 1);
      if (lastSeen < 0) {
        break;
      }
      const newMolecules = initial.slice(0, lastSeen) + to + initial.slice(lastSeen + from_l);
      //console.log(from, to, lastSeen, newMolecules);
      tested[newMolecules] = true;
    }
  });

console.log('total: ', Object.keys(tested).length);
