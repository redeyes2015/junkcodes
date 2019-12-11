'use strict';

const fs = require('fs');
const input = fs.readFileSync('./day_11.input', 'utf-8');

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

class RobotMap {
    constructor() {
        this.map = new Map();
        this.painted = new Set();
    }
    _XYToKey (x, y) {
        return `${x},${y}`;
    }
    getColor(x, y) {
        const key = this._XYToKey(x, y);
        if (!this.map.has(key)) {
            this.map.set(key, 0);
        }
        return this.map.get(key);
    }
    paintColor(x, y, color) {
        const key = this._XYToKey(x, y);

        this.map.set(key, color);
        this.painted.add(key);
    }
}

const map = new RobotMap();
const memory = input.split(',').map(t => parseInt(t, 10));
const c = new Computer(memory.slice());

let x = 0;
let y = 0;
let direction = "^";

map.paintColor(0, 0, 1); // second part

const nextDirection = {
    "^": ["<", ">"],
    "<": ["v", "^"],
    "v": [">", "<"],
    ">": ["^", "v"],
};

const directionVector = {
    "^": { x: 0, y: 1},
    "<": { x: -1, y: 0},
    "v": { x: 0, y: -1},
    ">": { x: 1, y: 0},
};

while (true) {
    c.putNextInput(map.getColor(x, y));
    c.run();
    if (c.halted) {
        break;
    }
    const color = c.getNextOutput();
    map.paintColor(x, y, color);
    direction = nextDirection[direction][c.getNextOutput()];

    x += directionVector[direction].x
    y += directionVector[direction].y
}

//console.log(c.outputQueue);
//console.log(map.painted.size); // for first part

let maxX = -Infinity;
let maxY = -Infinity;
let minX = Infinity;
let minY = Infinity;
for (const coord of map.map.keys()) {
    const [x, y] = coord.split(',').map(v => parseInt(v, 10));
    maxX = Math.max(x, maxX);
    maxY = Math.max(y, maxY);
    minX = Math.min(x, minX);
    minY = Math.min(y, minY);
}

console.log(`(${maxX}, ${maxY}) - (${minX}, ${minY})`);

const mark = Array.from({length: maxX - minX + 1}, (_, x) => {
    return Array.from({length: maxY - minY + 1}, (_, y) => {
        return map.getColor(x + minX, y + minY);
    });
});

console.log(mark.map(r => r.join('')).join('\n')); // for second part
