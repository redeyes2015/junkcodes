'use strict';

/*
const input =`#############
#g#f.D#..h#l#
#F###e#E###.#
#dCba...BcIJ#
#####.@.#####
#nK.L...G...#
#M###N#H###.#
#o#m..#i#jk.#
#############`;
*/

const input = require('fs').readFileSync('./day_18.input', 'utf-8');


const patchMap = (map) => {
    const initPosRow = map.findIndex(l => l.includes('@'));
    const initPosCol = Array.from(map[initPosRow]).findIndex(c => c == '@');

    map[initPosRow] = map[initPosRow].replace('.@.', '###');
    const modLine = (line, mark1, mark2) => {
        return Array.from(line).map((c, col) => {
            if (col == initPosCol) {
                return '#';
            }
            if (col == initPosCol - 1) {
                return mark1;
            }
            if (col == initPosCol + 1) {
                return mark2;
            }
            return c;
        }).join('');
    }
    map[initPosRow - 1] = modLine(map[initPosRow - 1], '0', '1');
    map[initPosRow + 1] = modLine(map[initPosRow + 1], '2', '3');
};

const map = input.split('\n');
const rows = map.length;
const cols = map[0].length;
patchMap(map);

const withinRange = (v, max) => v >= 0 && v <= max;
const withinMap = (p) => withinRange(p.row, rows - 1) && withinRange(p.col, cols - 1);

class Coord {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
    getAdjacentPos () {
        return [
            new Coord(this.row - 1, this.col),
            new Coord(this.row + 1, this.col),
            new Coord(this.row, this.col - 1),
            new Coord(this.row, this.col + 1),
        ];
    }
    toKey () {
        return `(${this.row}, ${this.col})`;
    }
    get type () {
        return map[this.row][this.col];
    }
    get isKey () {
        return /[a-z]/.test(this.type);
    }
    get isDoor () {
        return /[A-Z]/.test(this.type);
    }
    get isRobot () {
        return /[0123]/.test(this.type);
    }
}

class KeyToKey {
    constructor(dist, doorInBetween) {
        this.dist = dist;
        this.doorInBetween = doorInBetween;
    }
}


const bfs = (origin) => {
    let queue = origin.getAdjacentPos().filter(withinMap).map(pos => [pos, new Set()]);
    const distMap = new Map();
    const encountered = new Set([origin.toKey()]);
    let step = 1;

    const originC = map[origin.row][origin.col];
    distMap.set(originC, new KeyToKey(0, new Set()));

    while (queue.length > 0) {
        const nextQueue = [];

        for (const [pos, doorInBetween] of queue) {
            const posKey = pos.toKey();

            if (encountered.has(posKey)) {
                continue;
            }
            encountered.add(posKey);

            const c = map[pos.row][pos.col];
            if (c == '#') {
                continue;
            }
            if (pos.isRobot || pos.isKey) {
                distMap.set(c, new KeyToKey(step, new Set(doorInBetween)));
            }
            const nextDoorInBetween = new Set(doorInBetween);
            if (pos.isDoor) {
                nextDoorInBetween.add(c);
            }
            nextQueue.push(
                pos.getAdjacentPos().filter(withinMap).map(pos => [pos, nextDoorInBetween])
            );
        }

        queue = nextQueue.flat();
        step += 1;
    }
    return distMap;
};


const POI = map.flatMap(
    (line, row) => {
        return Array.from(line, (c, col) => (c == '#' || c == '.' ? [] : [new Coord(row, col)])).flat()
    }
);

const poiMap = new Map();
const allKeys = new Set();
for (const p of POI) {
    if (p.isDoor) {
        continue;
    }
    const c = map[p.row][p.col];
    poiMap.set(c, bfs(p));
    if (p.isKey) {
        allKeys.add(c);
    }
}

const dumpPoiMap = (poiMap) => {
    for (const [k, distMap] of poiMap) {
        console.log(`${k} ---->`);
        for (const [o, toKey] of distMap) {
            const doors = [...toKey.doorInBetween].join('');
            console.log(`    ${o}, ${toKey.dist}, ${doors}`);
        }
    }
};
//dumpPoiMap(poiMap);

const haveEnoughKey = (doorInBetween, leftKeys) => {
    for (const door of doorInBetween) {
        if (leftKeys.has(door.toLowerCase())) {
            return false;
        }
    }
    return true;
};

const cache = new Map();
const stateToKey = (state) => `${state.pos.join()}|${[...state.leftKeys].sort().join('')}`;
const explore = (state) => {
    const stateKey = stateToKey(state);
    if (cache.has(stateKey)) {
        return cache.get(stateKey);
    }

    if (state.leftKeys.size == 0) {
        return 0;
    }

    let minSteps = Infinity; // steps to collect all left keys
    for (const [robotIndex, robotPos] of state.pos.entries()) {
        for (const [k, toKey] of poiMap.get(robotPos)) {
            if (!state.leftKeys.has(k) || !haveEnoughKey(toKey.doorInBetween, state.leftKeys)) {
                continue;
            }
            const nextState = {
                pos: state.pos.slice(),
                leftKeys: new Set(state.leftKeys),
            };
            nextState.leftKeys.delete(k);
            nextState.pos[robotIndex] = k;
            minSteps = Math.min(minSteps, toKey.dist + explore(nextState));
        }
    }

    cache.set(stateKey, minSteps);
    return minSteps;
}

const state = {
    pos: ['0','1','2','3'],
    leftKeys: new Set(allKeys),
};

console.log(explore(state));
