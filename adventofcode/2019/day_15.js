'use strict';

const fs = require('fs');
const input = fs.readFileSync('./day_15.input', 'utf-8');

class Computer {
    constructor(memory) {
        this.memory = memory;
        this.inputQueue = [];
        this.outputQueue = [];
        this.pc = 0;
        this.relativeBase = 0;

        this.actMap = {
            "1": () => this.triOpAct((a, b) => a + b),
            "2": () => this.triOpAct((a, b) => a * b),
            "7": () => this.triOpAct((a, b) => a < b ? 1 : 0),
            "8": () => this.triOpAct((a, b) => a == b ? 1 : 0),

            "5": () => this.jumpAct(v => v != 0),
            "6": () => this.jumpAct(v => v == 0),

            "3": () => {
                if (this.inputQueue.length <= 0) {
                    throw 'Input stack empty';
                }
                this.setToOprand(1, this.inputQueue.shift());
                this.pc += 2;
            },
            "4": () => {
                this.outputQueue.push(this.getOprand(1));
                this.pc += 2;
            },

            "9": () => {
                this.relativeBase += this.getOprand(1);
                this.pc += 2;
            },
        };
    }
    get halted () {
        return this.currentInst == 99;
    }
    get currentInst () {
        return this.getMemory(this.pc);
    }
    getMemory (offset) {
        if (typeof this.memory[offset] == "undefined") {
            this.memory[offset] = 0;
        }
        return this.memory[offset];
    }
    getOprandInfo (pos) {
        const val = this.getMemory(this.pc + pos);
        const modeDigit = Math.floor(this.currentInst / (10 * (10 ** pos))) % 10;
        if (modeDigit == 1) {
            return {
                immediate: true,
                val,
            };
        }
        const base = modeDigit == 2 ? this.relativeBase : 0;
        return {
            immediate: false,
            val: val + base,
        };
    }
    setToOprand (pos, value) {
        const oprandInfo = this.getOprandInfo(pos);
        if (oprandInfo.immediate) {
            throw "Can't write value to immediate mode";
        }
        this.memory[oprandInfo.val] = value;
    }
    getOprand (pos) {
        const oprandInfo = this.getOprandInfo(pos);
        if (oprandInfo.immediate) {
            return oprandInfo.val;
        }
        return this.getMemory(oprandInfo.val);
    }
    triOpAct (act) {
        this.setToOprand(3, act(this.getOprand(1), this.getOprand(2)));
        this.pc += 4;
    }
    jumpAct (predic) {
        if (predic(this.getOprand(1))) {
            this.pc = this.getOprand(2);
        } else {
            this.pc += 3;
        }
    }
    run () {
        while (!this.halted) {
            const act = this.actMap[this.currentInst % 100];
            if (!act) {
                throw `Unknown operation: ${this.currentInst} @ ${this.pc}`;
            }
            try {
                act();
            } catch (e) {
                if (e == 'Input stack empty') {
                    return;
                }
                throw e;
            }
        }
    }
    putNextInput (v) {
        this.inputQueue.push(v);
    }
    getNextOutput () {
        if (this.outputQueue.length <= 0) {
            throw "No next output available"
        }
        return this.outputQueue.shift();
    }
}

class Coord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toKey () {
        return `(${this.x},${this.y})`;
    }
    static fromKey(key) {
        const {x, y} = /^\((?<x>-?\d+),(?<y>-?\d+)\)$/.exec(key).groups;
        return new Coord(parseInt(x, 10), parseInt(y, 10));
    }
    addVector (v) {
        return new Coord(this.x + v.x, this.y + v.y);
    }
}

const memory = input.split(',').map(t => parseInt(t, 10));
const c = new Computer(memory.slice());

const map = new Map();

const dumpMap = (map) => {
    const points = Array.from(map.entries(), ([key, v]) => ({ pos: Coord.fromKey(key), char: v }));
    const xs = [...new Set(points.map(p => p.pos.x))];
    const ys = [...new Set(points.map(p => p.pos.y))];
    const maxX = xs.reduce((max, x) => Math.max(max, x), -Infinity);
    const maxY = ys.reduce((max, y) => Math.max(max, y), -Infinity);
    const minX = xs.reduce((min, x) => Math.min(min, x), Infinity);
    const minY = ys.reduce((min, y) => Math.min(min, y), Infinity);

    const newMap = new Map();
    points.forEach(({ pos: {x, y}, char }) => {
        if (!newMap.has(x)) {
            newMap.set(x, new Map([ [y, char] ]))
            return;
        }
        newMap.get(x).set(y, char);
    });

    for (let x = minX; x <= maxX; ++x) {
        if (!newMap.has(x)) {
            console.log('');
            continue;
        }
        const xMap = newMap.get(x);
        const row = [];
        for (let y = minY; y <= maxY; ++y) {
            row.push(xMap.get(y) || ' ');
        }
        console.log(row.join(''));
    }
};

const commandVector = {
    [1]: { x: 0, y: 1 },
    [2]: { x: 0, y: -1 },
    [3]: { x: -1, y: 0 },
    [4]: { x: 1, y: 0 },
};

const nextDirectionMap = {
    [1]: 3,
    [2]: 4,
    [3]: 2,
    [4]: 1,
};
const prevDirectionMap = {
    [1]: 4,
    [2]: 3,
    [3]: 1,
    [4]: 2,
};

let pos = new Coord(0, 0);
let target = null;

let prevDirection = 4;
let hitWall = false;

//while (true) {
for (let i = 0; i < 5000; ++i) {
    //const command = 1 + Math.floor(Math.random() * 4);
    const command = hitWall ? prevDirectionMap[prevDirection] : nextDirectionMap[prevDirection];
    hitWall = false;
    prevDirection = command;
    c.putNextInput(command);
    c.run();
    const output = c.getNextOutput();
    const nextCoord = pos.addVector(commandVector[command]);
    if (output == 0) {
        map.set(nextCoord.toKey(), '#');
        hitWall = true;
    } else if (output == 1) {
        pos = nextCoord;
        map.set(pos.toKey(), '.');
    } else if (output == 2) {
        pos = nextCoord;
        target = pos;
        map.set(pos.toKey(), 'v');
    }
}
//console.log(map);
//map.set(new Coord(0, 0).toKey(), 'X');
dumpMap(map);

const bfs1 = () => {
    let queue = [new Coord(0, 0)];
    let step = 0;
    const encountered = new Set();

    while (queue.length > 0) {
        const nextQueue = [];
        for (const checkPoint of queue) {
            console.log(checkPoint);
            const key = checkPoint.toKey();
            if (encountered.has(key)) {
                continue;
            }
            encountered.add(key);
            const v = map.get(key);
            if (v == 'v') {
                return step;
            }
            if (v != '.') {
                continue;
            }
            for (const direction of [1, 2, 3, 4]) {
                const next = checkPoint.addVector(commandVector[direction]);
                console.log("next:");
                console.log(next);
                nextQueue.push(next);
            }
        }
        queue = nextQueue;
        step += 1;
    }

    return Infinity;
}

// part I
//console.log(bfs1());

// part II
const bfs2 = (origin) => {
    let queue = [origin];
    let step = 0;
    let maxStep = 0;
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
            maxStep = step
            for (const direction of [1, 2, 3, 4]) {
                const next = checkPoint.addVector(commandVector[direction]);
                //console.log("next:");
                //console.log(next);
                if (map.get(next.toKey()) == '#') {
                    continue;
                }
                nextQueue.push(next);
            }
        }
        queue = nextQueue;
        step += 1;
    }

    return maxStep;
}

console.log(target);
console.log(bfs2(target));
