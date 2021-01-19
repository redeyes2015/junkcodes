//const input = require('fs').readFileSync('input.test', 'utf-8');
const input = require('fs').readFileSync('input', 'utf-8');

function revers(s) {
    return Array.from(s).reverse().join('');
}
function isSameEdge (a, b) {
    return a == b || reverse(a) == b;
}

function genEdges(tile) {
    return [
        tile[0],
        tile.map(r => r[r.length - 1]).join(''),
        tile[tile.length - 1],
        tile.map(r => r[0]).join(''),
    ];
}

function parse2Tiles (input) {
    const sections = input.split('\n\n').filter(s => s.length > 0);
    return new Map(sections.map(sect => {
        const lines = sect.split('\n').filter(l => l.length > 0);
        return [lines[0].slice(5, -1), lines.slice(1)];
    }));
}
function parse (input) {
    const sections = input.split('\n\n').filter(s => s.length > 0);
    return new Map(sections.map(sect => {
        const lines = sect.split('\n').filter(l => l.length > 0);
        const edges = genEdges(lines.slice(1));
        return [lines[0].slice(5, -1), edges];
    }));
}

//console.log([...parse(input).keys()]);

function linkTiles (tileMap) {
    const seenEdges = new Map();
    const neighborMap = new Map(Array.from(tileMap.keys(), (id) => [id, []]));
    for (const [id, edges] of tileMap) {
        for (const [idx, e] of edges.entries()) {
            let seenId = seenEdges.get(e) || seenEdges.get(revers(e));
            if (!seenId) {
                seenEdges.set(e, id);
                continue;
            }
            neighborMap.get(id).push(seenId);
            neighborMap.get(seenId).push(id);
        }
    }
    return neighborMap;
}

// console.log([...linkTiles(parse(input))]);

function rotate(pattern) {
    const result = Array.from(pattern[0], _ => []);
    const R = pattern.length - 1;
    for (let i = R; i >= 0; --i) {
        for (let j = 0; j < pattern[i].length; ++j) {
            result[j][R - i] = pattern[i][j];
        }
    }
    return result.map(r => r.join(''));
}

function flip (pattern) {
    return pattern.slice().reverse();
}

function toPattern(raw) {
    return raw[0].trim().split('\n');
}

function dumpPattern (pattern) {
    console.log(pattern.join('\n'));
}

/*
const matrix = toPattern`
123
456
789
`;

dumpPattern(matrix);
console.log('--------------------');
dumpPattern(rotate(matrix));
*/


const transforms = [
    p => p,
    p => rotate(p),
    p => rotate(p),
    p => rotate(p),
    p => flip(p),
    p => rotate(p),
    p => rotate(p),
    p => rotate(p),
];

function transformToMatch(edges, neighborPattern) {
    function findMatch() {
        const nEdges = genEdges(neighborPattern);
        for (let i = 0; i < 4; ++i) {
            if (edges[i] == nEdges[i ^ 2]) {
                return i;
            }
        }
        return -1;
    }
    for (const t of transforms) {
        neighborPattern = t(neighborPattern);
        const matchEdge = findMatch();
        if (matchEdge >= 0) {
            return {
                matchEdge,
                neighborPattern,
            };
        }
    }
    return -1;
}

function getNeighborCoord(r, c, edgeIndex) {
    switch (edgeIndex) {
        case 0:
            return {r: r - 1, c};
        case 1:
            return {r, c: c + 1};
        case 2:
            return {r: r + 1, c};
        case 3:
            return {r, c: c - 1};
        default :
            throw new Error('unknown edge index');
    }
}

const neighborMap = linkTiles(parse(input));
const tilesMap = parse2Tiles(input);
const bigMap = new Map();

const next = [];
for (const [id, pattern] of tilesMap) {
    next.push({
        r: 0,
        c: 0,
        id,
        pattern
    });
    break;
}
const tileSize = tilesMap.get(next[0].id).length;

while (next.length > 0) {
    const {r, c, id, pattern} = next.shift();
    if (bigMap.has(`${r},${c}`)) {
        continue;
    }
    bigMap.set(`${r},${c}`, {id, pattern});
    const edges = genEdges(pattern);
    for (const neighborId of neighborMap.get(id)) {
        const {
            matchEdge,
            neighborPattern
        } = transformToMatch(edges, tilesMap.get(neighborId));
        if (matchEdge < 0) {
            throw new Error(`not match !? ${id} vs. ${neighborId}`);
        }
        const {
            r: nr,
            c: nc,
        } = getNeighborCoord(r, c, matchEdge);
        next.push({
            r: nr,
            c: nc,
            id: neighborId,
            pattern: neighborPattern,
        });
    }
}

//console.log(Array.from(bigMap, ([coord, {id}]) => `${coord} => ${id}`).join('\n'));

const coords = Array.from(bigMap.keys(), k => k.split(',').map(v => parseInt(v, 10)));
const minRow = coords.reduce((min, [r]) => Math.min(min, r), Number.POSITIVE_INFINITY);
const maxRow = coords.reduce((max, [r]) => Math.max(max, r), Number.NEGATIVE_INFINITY);
const minCol = coords.reduce((min, [, c]) => Math.min(min, c), Number.POSITIVE_INFINITY);
const maxCol = coords.reduce((max, [, c]) => Math.max(max, c), Number.NEGATIVE_INFINITY);

// console.log(`(${minRow}, ${minCol}) x (${maxRow}, ${maxCol}), ${tileSize}`);

const stichedMap = [];
const usedTileSize = tileSize - 2;
for (let i = minRow; i <= maxRow; ++i) {
    for (let r = 0; r < usedTileSize; ++r) {
        stichedMap[(i - minRow) * usedTileSize + r] = [];
    }
    for (let j = minCol; j <= maxCol; ++j) {
        const tile = bigMap.get(`${i},${j}`).pattern;
        for (let r = 0; r < usedTileSize; ++r) {
            stichedMap[(i - minRow) * usedTileSize + r].push(tile[r + 1].slice(1, usedTileSize + 1));
        }
    }
    for (let r = 0; r < usedTileSize; ++r) {
        const row = (i - minRow) * usedTileSize + r;
        stichedMap[row] = stichedMap[row].join('');
    }
}
// console.log(stichedMap.map(r => r.join('')).join('\n'));

/*
01234567890123456789
*/
const dragonPattern = toPattern`
.                 #
#    ##    ##    ###
 #  #  #  #  #  #
`;

const dragonPins = dragonPattern.flatMap((str, row) => {
    return Array.from(str, (c, col) => ({ row, col , c }));
}).filter(({c}) => c == '#');
// console.log(dragonPins);

function findDragon (searchingMap) {
    let count = 0;
    for (let i = 0; i < searchingMap.length; ++i) {
        for (let j = 0; j < searchingMap[i].length; ++j) {
            const found = dragonPins.every(({ row, col }) => {
                row += i;
                col += j;
                return (
                    row < searchingMap.length &&
                    col < searchingMap[0].length &&
                    searchingMap[row][col] == '#'
                );
            });
            if (found) {
                count += 1;
            }
        }
    }
    return count;
}

/*
const resultMap = toPattern`
.####...#####..#...###..
#####..#..#.#.####..#.#.
.#.#...#.###...#.##.##..
#.#.##.###.#.##.##.#####
..##.###.####..#.####.##
...#.#..##.##...#..#..##
#.##.#..#.#..#..##.#.#..
.###.##.....#...###.#...
#.####.#.#....##.#..#.#.
##...#..#....#..#...####
..#.##...###..#.#####..#
....#.##.#.#####....#...
..##.##.###.....#.##..#.
#...#...###..####....##.
.#.##...#.##.#.#.###...#
#.###.#..####...##..#...
#.###...#.##...#.######.
.###.###.#######..#####.
..##.#..#..#.#######.###
#.#..##.########..#..##.
#.#####..#.#...##..#....
#....##..#.#########..##
#...#.....#..##...###.##
#..###....##.#...##.##.#
`;
findDragon(resultMap);
*/

let searchingMap = stichedMap;
for (const [transformId, t] of transforms.entries()) {
    searchingMap = t(searchingMap);

    const found = findDragon(searchingMap);
    if (found > 0) {
        const sharpCount = searchingMap.map(r => {
            return Array.from(r).filter(c => c == '#').length;
        }).reduce((s, c) => s + c, 0);
        console.log(`found: ${found} ; sharpCount: ${sharpCount} ; answer: ${sharpCount - found * dragonPins.length}`);
    }
}
