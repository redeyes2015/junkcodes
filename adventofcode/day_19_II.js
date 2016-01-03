'use strict';

const inputFile = 'day_19.input';

const input = require('fs').readFileSync(inputFile, {encoding: 'ascii'});

const inputParts = input.split('\n\n');

const formatRE = /^(\w+) => (\w+)$/;

const transformLines = inputParts[0];

const target = inputParts[1].trim();

const transforms = transformLines.split('\n').map(line => {
    const result = formatRE.exec(line);
    if (result == null) {
      throw line;
    }
    return {
      from: result[1],
      to: result[2]
    }
  });

let mutCount = 0;

function tryTransforms(prev, transform) {
    const from = transform.from;
    const to = transform.to;
    const to_l = to.length;
    let lastSeen = prev.indexOf(to);
    if (lastSeen < 0) {
      return prev
    }
    mutCount += 1;
    return prev.slice(0, lastSeen) + from + prev.slice(lastSeen + to_l);
}

let string = target;

while (string != 'e') {
 string = transforms.reduce((prev, trans) => tryTransforms(prev, trans), string);
}

console.log(string, mutCount);
