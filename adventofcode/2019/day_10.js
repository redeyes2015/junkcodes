"use strict";

/*
// 8
const input = `.#..#
.....
#####
....#
...##`;
*/

/*
// 33
const input = `......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####`;
*/

/*
// 41
const input = `.#..#..###
####.###.#
....###.#.
..###.##.#
##.##.#.#.
....###..#
..#.#..#.#
#..#.#.###
.##...##.#
.....#.#..`;
*/

/*
// 210
const input = `.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`;
*/


const fs = require('fs');
const input = fs.readFileSync('./day_10.input', 'utf-8');
const map = input.split('\n')

const rows = map.length;
const cols = map[0].length;

const isCoPrime = (a, b) => {
    let [top, below] = [ Math.min(a, b), Math.max(a, b) ];

    while (below > 1) {
        let mod = top % below;
        if (mod == 0) {
            return false;
        }
        [top, below] = [below, mod];
    }

    return true;
};


const allCoordGenerator = function *() {
    for (let r = 0; r < rows; ++r) {
        for (let c = 0; c < cols; ++c) {
            yield [r, c];
        }
    }
}

const coPrimePairs = [
    [0, 1],
    [1, 0],
];
for (const [r, c] of allCoordGenerator()) {
    if (r == 0 || c == 0) {
        continue;
    }
    if (isCoPrime(r, c)) {
        coPrimePairs.push([r, c]);
    }
}

//console.log(coPrimePairs.map(([a, b]) => `[${a}, ${b}]`));

const vectorMultipliers = [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1]
];

//const countMap = map.slice().map(r => Array.from(r, c => c == '.' ? '.' : 0));

const changeDirection = (vector, multiplier) => [vector[0] * multiplier[0], vector[1] * multiplier[1]];
const addToCoord = (coord, vector) => [coord[0] + vector[0], coord[1] + vector[1]];
const isInRange = (v, min, max) => v >= min && v <= max;

const isInMap = ([r, c]) => isInRange(r, 0, rows - 1) && isInRange(c, 0, cols - 1);

let maxCount = 0;

for (const [r, c] of allCoordGenerator()) {
    if (map[r][c] == ".") {
        continue;
    }
    let count = 0;

    for (const primePair of coPrimePairs) {
        for (const mult of vectorMultipliers) {
            if (primePair[0] == 0 && mult[0] == -1) {
                continue;
            }
            if (primePair[1] == 0 && mult[1] == -1) {
                continue;
            }
            const vector = changeDirection(primePair, mult);
            //console.log(`vector: [${vector[0]}, ${vector[1]}]`);
            for (let checkPoint = addToCoord([r, c], vector); isInMap(checkPoint); checkPoint = addToCoord(checkPoint, vector)){
                //console.log(`checking : [${checkPoint[0]}, ${checkPoint[1]}]`);
                if (map[checkPoint[0]][checkPoint[1]] == '#') {
                    count += 1;
                    break;
                }
            }
        }
    }

    maxCount = Math.max(maxCount, count);
    if (maxCount == count) {
        console.log(`${r}, ${c}`);
    }
    //countMap[r][c] = count;
}

//console.log(countMap.map(r => r.join('')));
console.log(maxCount);
