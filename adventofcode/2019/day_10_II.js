"use strict";

/*
const input = `.#....#####...#..
##...##.#####..##
##...#...#.#####.
..#.....#...###..
..#.#.....#....##`;
const stationCoord = [3,8];
const bet = 200;
*/

/*
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
const stationCoord = [13,11]; // coordinate got swapped...
const bet = 200;
*/

const fs = require('fs');
const input = fs.readFileSync('./day_10.input', 'utf-8');
const stationCoord = [34,30];
const bet = 200;

const map = input.split('\n').map(r => Array.from(r));

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

const vectorMultipliers = [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1]
];
const changeDirection = (vector, multiplier) => [vector[0] * multiplier[0], vector[1] * multiplier[1]];

const coPrimePairs = [
    // special cases ... don't mess them up with vectorMultipliers
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    // end of special cases
];

for (let r = 1; r < rows; ++r) {
    for (let c = 1; c < cols; ++c) {
        const pair = [r, c];
        for (const mult of vectorMultipliers) {
            if (isCoPrime(r, c)) {
                coPrimePairs.push(changeDirection(pair, mult));
            }
        }
    }
}

const getRad = ([r, c]) => {
    if (c == 0) {
        return 0.5 * Math.PI * (r > 0 ? 1 : -1);
    }
    return Math.atan(r / c) + (c < 0 ? Math.PI : 0);
}

coPrimePairs.sort((v1, v2) => getRad(v1) - getRad(v2));

console.log(coPrimePairs.slice(0, 10).map(([r, c]) => `${r}, ${c}`));
console.log(coPrimePairs.slice(-10).reverse().map(([r, c]) => `${r}, ${c}`));

const addToCoord = (coord, vector) => [coord[0] + vector[0], coord[1] + vector[1]];
const isInRange = (v, max) => v >= 0 && v <= max;
const isInMap = ([r, c]) => isInRange(r, rows - 1) && isInRange(c, cols - 1);

function *vaporizor () {
    while (true) {
        let hitInThisRound = false;
        for (const vector of coPrimePairs) {
            for (let checkPoint = addToCoord(stationCoord, vector); isInMap(checkPoint); checkPoint = addToCoord(checkPoint, vector)){
                if (map[checkPoint[0]][checkPoint[1]] == '#') {
                    hitInThisRound = true;
                    yield checkPoint;
                    break;
                }
            }
        }
        if (!hitInThisRound) {
            break;
        }
    }
}

let count = 1;
for (const [r, c] of vaporizor()) {
    console.log(`#${count} : (${r}, ${c})`);
    map[r][c] = '.';
    count += 1;
    if (count > bet) {
        break;
    }
}
