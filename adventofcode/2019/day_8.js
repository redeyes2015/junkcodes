"use strict";
const fs = require("fs");

const input = fs.readFileSync("./day_8.input", "utf-8");
const width = 25;
const height = 6;

//const input = "123456789012";
//const width = 3;
//const height = 2;

const toLayers = (input) => {
    const layers = [];
    const layerSize = height * width;
    for (let i = 0; (i + layerSize) <= input.length; i += layerSize) {
        layers.push(input.slice(i, i + layerSize));
    }
    return layers;
}

const countChar = char => (s => Array.from(s).filter(c => c == char).length);
const countZero = countChar("0");
const countOne = countChar("1");
const countTwo = countChar("2");

const layers = toLayers(input);
console.log(`Get ${layers.length} layers`);

const minZeroLayer = toLayers(input)
  .map(layer => ({ layer, zero: countZero(layer) }))
  .reduce((minZeroLayer, next) => next.zero < minZeroLayer.zero ? next : minZeroLayer)
  .layer

console.log(minZeroLayer);
console.log(countOne(minZeroLayer) * countTwo(minZeroLayer));
