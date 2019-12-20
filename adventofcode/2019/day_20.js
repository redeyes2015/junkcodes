'use strict';

/*
const input = `
         A           
         A           
  #######.#########  
  #######.........#  
  #######.#######.#  
  #######.#######.#  
  #######.#######.#  
  #####  B    ###.#  
BC...##  C    ###.#  
  ##.##       ###.#  
  ##...DE  F  ###.#  
  #####    G  ###.#  
  #########.#####.#  
DE..#######...###.#  
  #.#########.###.#  
FG..#########.....#  
  ###########.#####  
             Z       
             Z       `.slice(1);
*/

/*
const input = `
                   A
                   A
  #################.#############
  #.#...#...................#.#.#
  #.#.#.###.###.###.#########.#.#
  #.#.#.......#...#.....#.#.#...#
  #.#########.###.#####.#.#.###.#
  #.............#.#.....#.......#
  ###.###########.###.#####.#.#.#
  #.....#        A   C    #.#.#.#
  #######        S   P    #####.#
  #.#...#                 #......VT
  #.#.#.#                 #.#####
  #...#.#               YN....#.#
  #.###.#                 #####.#
DI....#.#                 #.....#
  #####.#                 #.###.#
ZZ......#               QG....#..AS
  ###.###                 #######
JO..#.#.#                 #.....#
  #.#.#.#                 ###.#.#
  #...#..DI             BU....#..LF
  #####.#                 #.#####
YN......#               VT..#....QG
  #.###.#                 #.###.#
  #.#...#                 #.....#
  ###.###    J L     J    #.#.###
  #.....#    O F     P    #.#...#
  #.###.#####.#.#####.#####.###.#
  #...#.#.#...#.....#.....#.#...#
  #.#####.###.###.#.#.#########.#
  #...#.#.....#...#.#.#.#.....#.#
  #.###.#####.###.###.#.#.#######
  #.#.........#...#.............#
  #########.###.###.#############
           B   J   C
           U   P   P               `.slice(1);
*/

const input = require('fs').readFileSync('./day_20.input', 'utf-8');

const map = input.split('\n');
const rows = map.length;
const cols = map.reduce((cols, l) => Math.max(cols, l.length), 0);

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
}

class Portal {
    constructor(label) {
        this.label = label;
        this.ends = [];
    }
    addEnd (pos) {
        this.ends.push(pos);
    }
    toTheOtherEnd (pos) {
        return this.ends.find(e => e.row != pos.row || e.col != pos.col);
    }
}

const posToPortal = new Map();
const labelToPortal = new Map();

const setPortalEnd = (label, pos) => {
    if (!labelToPortal.has(label)) {
        labelToPortal.set(label, new Portal(label));
    }
    const portal = labelToPortal.get(label);
    portal.addEnd(pos);
    posToPortal.set(pos.toKey(), portal);
};

for (let r = 1; r < rows; ++r) {
    for (let c = 1; c < cols; ++c) {
        if (!/[A-Z]/.test(map[r][c])) {
            continue;
        }
        if (/[A-Z]/.test(map[r - 1][c])) {
            const label = map[r - 1][c] + map[r][c];
            let portalPos = new Coord(r - 2, c)
            if (!withinMap(portalPos) || map[portalPos.row][portalPos.col] !== '.') {
                portalPos = new Coord(r + 1, c);
                if (!withinMap(portalPos) || map[portalPos.row][portalPos.col] != '.') {
                    throw `Can't find portal for label at (${r},${c})`;
                }
            }
            console.log(`${label} : (${portalPos.row}, ${portalPos.col})`);
            setPortalEnd(label, portalPos);
        }
        if (/[A-Z]/.test(map[r][c - 1])) {
            const label = map[r][c - 1] + map[r][c];
            const portalPos = new Coord(r, c - 2);
            if (!withinMap(portalPos) || map[portalPos.row][portalPos.col] !== '.') {
                portalPos.col = c + 1;
                if (!withinMap(portalPos) || map[portalPos.row][portalPos.col] != '.') {
                    throw `Can't find portal for label at (${r},${c})`;
                }
            }
            console.log(`${label} : (${portalPos.row}, ${portalPos.col})`);
            setPortalEnd(label, portalPos);
        }
    }
}

const bfs = (origin) => {
    let queue = [origin];
    let step = 0;
    const encountered = new Set();

    while (queue.length > 0) {
        const nextQueue = [];
        for (const checkPoint of queue) {
            //console.log(checkPoint);
            const key = checkPoint.toKey();
            if (encountered.has(key)) {
                continue;
            }
            encountered.add(key);

            const char = map[checkPoint.row][checkPoint.col];
            if (char != '.') {
                continue;
            }
            const portal = posToPortal.get(key);
            if (portal) {
                //console.log(portal);
                if (portal.label == 'ZZ') {
                    return step;
                }
                const theOtherEnd = portal.toTheOtherEnd(checkPoint);
                if (theOtherEnd) {
                    nextQueue.push(theOtherEnd);
                }
            }

            nextQueue.push(checkPoint.getAdjacentPos().filter(withinMap));
        }
        queue = nextQueue.flat();
        step += 1;
    }
    return Infinity;
}

console.log(bfs(labelToPortal.get('AA').ends[0]));
