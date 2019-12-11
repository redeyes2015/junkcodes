"use strict";
const fs = require("fs");

const input = fs.readFileSync("./day_8.input", "utf-8");
const width = 25;
const height = 6;

//const input = "0222112222120000";
//const width = 2;
//const height = 2;

const zapLayers = (input, width, height) => {
    const message = [];
    const layerSize = height * width;
    for (let i = 0; i < layerSize; ++i) {
        let j = i;
        while (j < input.length && input[j] == "2") {
            j += layerSize;
        }
        message.push(input[j] || "2")
    }
    return message.join('');
}
console.log(zapLayers(input, width, height));

