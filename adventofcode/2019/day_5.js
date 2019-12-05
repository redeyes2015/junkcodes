'use strict';

const fs = require('fs');

const input = fs.readFileSync('./day_5.input', 'utf-8');
const memory = input.split(',').map(t => parseInt(t, 10));

const pcStep = {
    "1": 4,
    "2": 4,
    "3": 2,
    "4": 2,
};

const getOp = n => n % 100;

const inputStack = [1];

const run = (memory) => {
    let pc = 0;

    const getOprand = (inst, pos, val) => {
        pos = 10 * (10 ** pos);
        if (Math.floor(inst / pos) % 10 == 1) {
            return val; // immediate mode
        }
        return memory[val];
    }
    const triOpAct = (inst, act) => {
        memory[memory[pc + 3]] = act(getOprand(inst, 1, memory[pc + 1]), getOprand(inst, 2, memory[pc + 2]));
        pc += 4;
    };
    const actMap = {
        "1": (inst) => triOpAct(inst, (a, b) => a + b),
        "2": (inst) => triOpAct(inst, (a, b) => a * b),
        "3": (inst) => {
            if (inputStack.length <= 0) {
                throw 'Input stack empty';
            }
            memory[memory[pc + 1]] = inputStack.pop();
            pc += 2;
        },
        "4": (inst) => {
            console.log(getOprand(inst, 1, memory[pc + 1]));
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

/*
for (let noun = 0; noun <= 99; ++noun) {
    for (let verb = 0; verb <= 99; ++verb) {
        const newMemory = memory.slice();

        newMemory[1] = noun;
        newMemory[2] = verb;
        if (run(newMemory) == 19690720) {
            console.log(100 * noun + verb);
            noun = 100;
            break;
        }
    }
}
*/
