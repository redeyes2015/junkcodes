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
             Z L X W       C                 
             Z P Q B       K                 
  ###########.#.#.#.#######.###############  
  #...#.......#.#.......#.#.......#.#.#...#  
  ###.#.#.#.#.#.#.#.###.#.#.#######.#.#.###  
  #.#...#.#.#...#.#.#...#...#...#.#.......#  
  #.###.#######.###.###.#.###.###.#.#######  
  #...#.......#.#...#...#.............#...#  
  #.#########.#######.#.#######.#######.###  
  #...#.#    F       R I       Z    #.#.#.#  
  #.###.#    D       E C       H    #.#.#.#  
  #.#...#                           #...#.#  
  #.###.#                           #.###.#  
  #.#....OA                       WB..#.#..ZH
  #.###.#                           #.#.#.#  
CJ......#                           #.....#  
  #######                           #######  
  #.#....CK                         #......IC
  #.###.#                           #.###.#  
  #.....#                           #...#.#  
  ###.###                           #.#.#.#  
XF....#.#                         RF..#.#.#  
  #####.#                           #######  
  #......CJ                       NM..#...#  
  ###.#.#                           #.###.#  
RE....#.#                           #......RF
  ###.###        X   X       L      #.#.#.#  
  #.....#        F   Q       P      #.#.#.#  
  ###.###########.###.#######.#########.###  
  #.....#...#.....#.......#...#.....#.#...#  
  #####.#.###.#######.#######.###.###.#.#.#  
  #.......#.......#.#.#.#.#...#...#...#.#.#  
  #####.###.#####.#.#.#.#.###.###.#.###.###  
  #.......#.....#.#...#...............#...#  
  #############.#.#.###.###################  
               A O F   N                     
               A A D   M                     `.slice(1);
*/

const input = require('fs').readFileSync('./day_20.input', 'utf-8');

const map = input.split('\n').filter(l => l.length > 0);
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
        this.innerEnd = null;
        this.outerEnd = null;
    }
    toTheOtherEnd (pos) {
        if (this.innerEnd.row != pos.row || this.innerEnd.col != pos.row) {
            return this.innerEnd;
        }
        return this.outerEnd;
    }
}

const isOuterPortal = (pos) => (pos.row == 2 || pos.col == 2 ||
                         pos.row + 3 == rows || pos.col + 3 == cols);

const posToPortal = new Map();
const labelToPortal = new Map();

const setPortalEnd = (label, pos) => {
    if (!labelToPortal.has(label)) {
        labelToPortal.set(label, new Portal(label));
    }
    const portal = labelToPortal.get(label);
    if (isOuterPortal(pos)) {
        portal.outerEnd = pos;
    } else {
        portal.innerEnd = pos;
    }
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
            setPortalEnd(label, portalPos);
        }
    }
}

//for (const portal of labelToPortal.values()) {
    //console.log(portal.label);
//}


class Agent {
    constructor(pos, portals) {
        this.pos = pos;
        this.portals = portals;
        if (!Array.isArray(portals)) {
            throw `invalid portal! ${portals}`;
        }
    }
    get level () {
        if (!Array.isArray(this.portals)) {
            throw `invalid portal! ${this.portals}`;
        }
        return this.portals.length;
    }
    get char () {
        return map[this.pos.row][this.pos.col];
    }
    toKey () {
        return `${this.level}|${this.pos.toKey()}`;
    }
}

let maxQueueLength = 0;
let maxLevel = 0;

const bfs = (origin) => {
    let queue = [new Agent(origin, [])];
    let step = 0;
    const encountered = new Set();

    while (queue.length > 0) {
        const nextQueue = [];
        maxQueueLength = Math.max(maxQueueLength, queue.length);
        //console.log(maxQueueLength, maxLevel);
        for (const agent of queue) {
            maxLevel = Math.max(maxLevel, agent.level);
            //console.log(agent);
            const key = agent.toKey();
            if (encountered.has(key)) {
                continue;
            }
            encountered.add(key);

            const char = agent.char;
            if (char != '.') {
                continue;
            }
            const checkPoint = agent.pos;
            const portal = posToPortal.get(checkPoint.toKey());
            if (portal) {
                //console.log(portal);
                if (portal.label == 'ZZ' && agent.level == 0) {
                    return step;
                }
                if (portal.innerEnd) {
                    if (portal.innerEnd.row == checkPoint.row && portal.innerEnd.col == checkPoint.col) {
                        //if (!agent.portals.includes(portal)) {
                        if (agent.portals.filter(p => p == portal).length <= 1) {
                            nextQueue.push(new Agent(portal.outerEnd, [...agent.portals, portal]));
                        }
                    } else if (agent.level > 0) {
                        nextQueue.push(new Agent(portal.innerEnd, agent.portals.slice(0, -1)));
                    }
                }
            }

            nextQueue.push(
                checkPoint.getAdjacentPos()
                    .filter(withinMap)
                    .map(pos => new Agent(pos, agent.portals))
            );
        }
        queue = nextQueue.flat();
        step += 1;
    }
    return Infinity;
}

console.log(bfs(labelToPortal.get('AA').outerEnd));
console.log(maxQueueLength, maxLevel);
