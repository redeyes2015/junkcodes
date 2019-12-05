'use strict';

const fs = require('fs');

const input = fs.readFileSync('./day_5.input', 'utf-8');
//const input = "3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99";
const memory = input.split(',').map(t => parseInt(t, 10));

const pcStep = {
    "1": 4,
    "2": 4,
    "3": 2,
    "4": 2,
    "5": 3,
    "6": 3,
    "7": 4,
    "8": 4
};

const getOp = n => n % 100;

const inputStack = [5];

const run = (memory) => {
    let pc = 0;

    const getOprand = (inst, pos) => {
        const val = memory[pc + pos];
        pos = 10 * (10 ** pos);
        if (Math.floor(inst / pos) % 10 == 1) {
            return val; // immediate mode
        }
        return memory[val];
    }
    const triOpAct = (inst, act) => {
        memory[memory[pc + 3]] = act(getOprand(inst, 1), getOprand(inst, 2));
        pc += 4;
    };
    const jumpAct = (inst, predic) => {
        if (predic(getOprand(inst, 1))) {
            pc = getOprand(inst, 2);
        } else {
            pc += 3;
        }
    };
    const actMap = {
        "1": (inst) => triOpAct(inst, (a, b) => a + b),
        "2": (inst) => triOpAct(inst, (a, b) => a * b),
        "7": (inst) => triOpAct(inst, (a, b) => a < b ? 1 : 0),
        "8": (inst) => triOpAct(inst, (a, b) => a == b ? 1 : 0),

        "5": (inst) => jumpAct(inst, v => v != 0),
        "6": (inst) => jumpAct(inst, v => v == 0),

        "3": (inst) => {
            if (inputStack.length <= 0) {
                throw 'Input stack empty';
            }
            memory[memory[pc + 1]] = inputStack.pop();
            pc += 2;
        },
        "4": (inst) => {
            console.log(getOprand(inst, 1));
            pc += 2;
        },

    };

    while (memory[pc] != 99) {
        const inst = memory[pc];
        const op = getOp(inst);
        
        if (pc + pcStep[op] >= input.length) {
            throw 'Not enough memory';
        }
        const act = actMap[op];
        if (!act) {
            throw 'Unknown operation';
        }
        act(inst);
    }
    return memory[0];
};

run(memory);
