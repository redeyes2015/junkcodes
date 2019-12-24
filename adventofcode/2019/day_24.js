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

const toAdacent = (r, c) => {
    return [
        [r + 1, c],
        [r - 1, c],
        [r, c + 1],
        [r, c - 1],
    ].filter(([r, c]) => {
        return withinRange(r, 0, rows - 1) && withinRange(c, 0, cols - 1);
    });
};

const adjacentBugCount = (map, r, c) => {
    return toAdacent(r, c).filter(([r, c]) => map[r][c] == '#').length;
};


const tick = (map) => {
    return map.map((line, r) => line.map((v, c) => {
        const count = adjacentBugCount(map, r, c);
        if (v == '#') {
            return count == 1 ? '#' : '.';
        }
        if (v == '.') {
            return (count == 1 || count == 2) ? '#' : '.';
        }
        throw 'unknown char!';
    }));
};

const genRating = (map) => {
    let rating = 0;
    for (const [r, line] of map.entries()) {
        for (const [c, v] of line.entries()) {
            if (v == '#') {
                rating += 2 ** (r * 5 + c);
            }
        }
    }
    return rating;
};

const encountered = new Set();

let state = map;
while (true) {
    const rating = genRating(state);
    if (encountered.has(rating)) {
        console.log(rating);
        break;
    }
    encountered.add(rating);
    state = tick(state);
}
