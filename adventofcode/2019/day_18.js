'use strict';

/*
const input = `#########
#b.A.@.a#
#########`;
*/

/*
const input = `########################
#f.D.E.e.C.b.A.@.a.B.c.#
######################.#
#d.....................#
########################`
*/

/*
const input = `########################
#...............b.C.D.f#
#.######################
#.....@.a.B.c.d.A.e.F.g#
########################`;
*/

/*
const input = `#################
#i.G..c...e..H.p#
########.########
#j.A..b...f..D.o#
########@########
#k.E..a...g..B.n#
########.########
#l.F..d...h..C.m#
#################`;
*/

/*
const input = `########################
#@..............ac.GI.b#
###d#e#f################
###A#B#C################
###g#h#i################
########################`
*/

const input = require('fs').readFileSync('./day_18.input', 'utf-8');

const map = input.split('\n');
const rows = map.length;
const cols = map[0].length;

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
}

class KeyToKey {
    constructor(key, dist, doorInBetween) {
        this.key = key;
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
    distMap.set(originC, new KeyToKey(originC, 0, new Set()));

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
            if (c == '@' || pos.isKey) {
                distMap.set(c, new KeyToKey(c, step, new Set(doorInBetween)));
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
const stateToKey = (state) => `${state.pos}|${[...state.leftKeys].sort().join('')}`;
const explore = (state) => {
    const stateKey = stateToKey(state);
    if (cache.has(stateKey)) {
        return cache.get(stateKey);
    }

    if (state.leftKeys.size == 0) {
        cache.set(stateKey, 0);
        return 0;
    }

    const toKeyMap = poiMap.get(state.pos);
    let minSteps = Infinity; // steps to collect all left keys
    for (const k of state.leftKeys) {
        const toKey = toKeyMap.get(k);
        if (!haveEnoughKey(toKey.doorInBetween, state.leftKeys)) {
            continue;
        }
        const nextLeftKeys = new Set(state.leftKeys);
        nextLeftKeys.delete(k);
        minSteps = Math.min(minSteps, toKey.dist + explore({
            pos: k,
            leftKeys: nextLeftKeys,
        }));
    }

    cache.set(stateKey, minSteps);
    return minSteps;
}

const state = {
    pos: '@',
    leftKeys: new Set(allKeys),
};

console.log(explore(state));
