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
K)YOU
I)SAN
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

let source = "";
let target = "";

for (const [center, orbit] of lines) {
    if (!graph.has(center)) {
        graph.set(center, []);
    }
    if (!graph.has(orbit)) {
        graph.set(orbit, []);
    }
    graph.get(center).push(orbit);
    graph.get(orbit).push(center);

    if (orbit == "YOU") {
        source = center;
    } else if (orbit == "SAN") {
        target = center;
    }
}

let encountered = new Set();

function dfs (orbit, step) {
    if (orbit == target) {
        return step;
    }
    if (encountered.has(orbit)) {
        return Infinity;
    }
    encountered.add(orbit);
    let minStep = Infinity;
    step += 1;
    for (const next of graph.get(orbit)) {
        minStep = Math.min(minStep, dfs(next, step));
    }
    return minStep;
}

//console.log(graph);
console.log(dfs(source, 0));


