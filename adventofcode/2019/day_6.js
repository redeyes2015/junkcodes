"use strict";
const fs = require("fs");

/*
const input = `COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
`;
*/
const input = fs.readFileSync("./day_6.input", "utf-8");

const lines = input.split("\n")
  .filter(l => l.length > 0)
  .map((rel) => {
      const match = /^([^)]+)\)(.+)$/.exec(rel);
      return [match[1], match[2]]
  });

const graph = new Map();

for (const [center, orbit] of lines) {
    if (!graph.has(center)) {
        graph.set(center, []);
    }
    graph.get(center).push(orbit);
}

let count = 0;
let level = 1;
let queue = ["COM"];
let encountered = new Set();

while (queue.length > 0) {
    const nextQueue = queue.flatMap(center => graph.get(center) || []);
    count += (level * nextQueue.length);
    level += 1;
    queue = nextQueue;
}

//console.log(graph);
console.log(count);


