'use strict';

/*
const input = `
....#
#..#.
#..##
..#..
#....`;
*/

const input = `
.#.##
..##.
##...
#...#
..###`;

const map = input.split('\n').filter(l => l.length > 0).map(l => Array.from(l));

const rows = map.length;
const cols = map[0].length;

const withinRange = (v, min, max) => v >= min && v <= max;

const toAdjacent = (r, c, d) => {
    d = parseInt(d, 10);
    const points = [];
    if (r == 0) {
        points.push([1, 2, d - 1]);
    }
    if (c == 0) {
        points.push([2, 1, d - 1]);
    }
    if (r == 4) {
        points.push([3, 2, d - 1]);
    }
    if (c == 4) {
        points.push([2, 3, d - 1]);
    }
    if ((r == 1 || r == 3) && c == 2) {
        const innerRow = r == 1 ? 0 : 4;
        points.push([innerRow, 0, d + 1])
        points.push([innerRow, 1, d + 1])
        points.push([innerRow, 2, d + 1])
        points.push([innerRow, 3, d + 1])
        points.push([innerRow, 4, d + 1])
    }
    if (r == 2 && (c == 1 || c == 3)) {
        const innerCol = c == 1 ? 0 : 4;
        points.push([0, innerCol, d + 1])
        points.push([1, innerCol, d + 1])
        points.push([2, innerCol, d + 1])
        points.push([3, innerCol, d + 1])
        points.push([4, innerCol, d + 1])
    }
    [
        [r + 1, c],
        [r - 1, c],
        [r, c + 1],
        [r, c - 1],
    ].filter(([r, c]) => {
        return (r != 2 || c != 2) && withinRange(r, 0, rows - 1) && withinRange(c, 0, cols - 1);
    }).forEach(([r, c]) => {
        points.push([r, c, d]);
    });
    return points;
};

const adjacentBugCount = (maps, r, c, d) => {
    return toAdjacent(r, c, d)
        .filter(([r, c, d]) => maps[d] && maps[d][r][c] == '#').length;
};

const genNewMap = () => Array.from({length: 5}, () => Array.from('.....'));
const countBug = (map) => map.reduce((s, l) => s += l.filter(c => c == '#').length, 0);

const tick = (maps) => {
    const newMaps = {};
    let minDepth = 0;
    let maxDepth = 0;

    const tickMap = (map, depth) => map.map((line, r) => line.map((v, c) => {
        if (r == 2 && c == 2) {
            return '?';
        }
        const count = adjacentBugCount(maps, r, c, depth);
        if (v == '#') {
            return count == 1 ? '#' : '.';
        }
        if (v == '.') {
            return (count == 1 || count == 2) ? '#' : '.';
        }
        throw 'unknown char!';
    }));
    for (const [depth, map] of Object.entries(maps)) {
        minDepth = Math.min(minDepth, depth);
        maxDepth = Math.max(maxDepth, depth);
        newMaps[depth] = tickMap(map, depth)
    }

    minDepth -= 1;
    maxDepth += 1;

    let map = tickMap(genNewMap(), minDepth);
    if (countBug(map) > 0) {
        newMaps[minDepth] = map;
    }
    map = tickMap(genNewMap(), maxDepth);
    if (countBug(map) > 0) {
        newMaps[maxDepth] = map;
    }
    return newMaps;
};

let maps = {
    [0]: map
};

for (let i = 1; i < 201; ++i) {
    maps = tick(maps);
    //console.log(`------- ${i} -------`);
    //console.log(maps);
}

console.log(Object.values(maps).reduce((sum, map) => sum + countBug(map), 0));
