'use strict';

const fs = require('fs');
const input = fs.readFileSync('./day_23.input', 'utf-8');

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
const nics = new Map(Array.from({length: 50}, (_, index) => {
    const c = new Computer(memory.slice());
    c.putNextInput(index);
    return [index, c];
}));

// Part I
/*
const tick = () => {
    const nextInputs = new Map();
    for (const [index, c] of nics) {
        c.run();
        while (c.outputQueue.length > 0) {
            const target = c.getNextOutput();
            const X = c.getNextOutput();
            const Y = c.getNextOutput();
            console.log(`${index} -> ${target}: ${X}, ${Y}`);
            if (target == 255) {
                console.log(`Y: ${Y}`);
                return true;
            }
            if (!nextInputs.has(target)) {
                nextInputs.set(target, []);
            }
            nextInputs.get(target).push([X, Y]);
        }
    }
    for (const [index, c] of nics) {
        if (!nextInputs.has(index)) {
            c.putNextInput(-1);
            continue;
        }
        for (const [X, Y] of nextInputs.get(index)) {
            c.putNextInput(X);
            c.putNextInput(Y);
        }
    }
    return false;
};

while (true) {
    if (tick()) {
        break;
    }
}
*/

// Part II
const tick = (lastNATPacket) => {
    const nextInputs = new Map();
    for (const [index, c] of nics) {
        c.run();
        while (c.outputQueue.length > 0) {
            const target = c.getNextOutput();
            const X = c.getNextOutput();
            const Y = c.getNextOutput();
            console.log(`${index} -> ${target}: ${X}, ${Y}`);
            if (target == 255) {
                lastNATPacket.X = X;
                lastNATPacket.Y = Y;
                continue;
            }
            if (!nextInputs.has(target)) {
                nextInputs.set(target, []);
            }
            nextInputs.get(target).push([X, Y]);
        }
    }
    const idled = nextInputs.size == 0;
    for (const [index, c] of nics) {
        if (idled && index === 0) {
            c.putNextInput(lastNATPacket.X);
            c.putNextInput(lastNATPacket.Y);
            continue;
        }
        if (!nextInputs.has(index)) {
            c.putNextInput(-1);
            continue;
        }
        for (const [X, Y] of nextInputs.get(index)) {
            c.putNextInput(X);
            c.putNextInput(Y);
        }
    }
    return idled;
};

let lastIdle = false;
let last2Idle = false;
let lastNATPacket = { X: 0, Y: 0 };
while (!lastIdle || !last2Idle) {
    last2Idle = lastIdle;
    lastIdle = tick(lastNATPacket, lastIdle);
    if (lastIdle) {
        console.log(lastNATPacket);
    }
}
console.log(lastNATPacket.Y);
