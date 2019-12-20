'use strict';

const fs = require('fs');
const input = fs.readFileSync('./day_19.input', 'utf-8');

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

const memory = input.split(',').map(t => parseInt(t, 10));

const cache = new Map();
const check = (row, col) => {
    if (col > 1000) {
        return false;
    }
    const key = `(${row},${col})`;
    if (cache.has(key)) {
        return cache.get(key);
    }
    const c = new Computer(memory.slice());
    c.putNextInput(row);
    c.putNextInput(col);
    c.run();
    const v = c.getNextOutput() == 1;
    cache.set(key, v);
    return v;
};

// Part I
/*
let count 0;
for (let i = 0; i < 50; ++i) {
    //const line = [];
    for (let j = 0; j < 50; ++j) {
        count += check(i, j) ? 1 : 0;
        //line.push(check(i, j) ? '#' : '.');
    }
    //console.log(line.join(''));
}
console.log(count);
*/

let found = false;
let prevJ = 0;
for (let i = 5; !found && i < 10000; ++i) {// skip lines without any beam...
    let j = prevJ;
    while (j < 10000 && !check(i, j)) {
        j += 1;
    }
    prevJ = j;
    for (; j < 10000 && check(i, j); ++j) {
        if (!check(i, j + 99)) {
            break;
        }
        if (check(i + 99, j) && check(i + 99, j + 99)) {
            console.log(`answer: ${i}, ${j}`);
            found = true;
            break;
        }
    }
}
