'use strict';

const fs = require('fs');

const input = fs.readFileSync('./day_7.input', 'utf-8');
//const input = "3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0";

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

const run = (memory, inputQueue) => {
    let pc = 0;
    const output = [];

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
            if (inputQueue.length <= 0) {
                throw 'Input stack empty';
            }
            memory[memory[pc + 1]] = inputQueue.shift();
            pc += 2;
        },
        "4": (inst) => {
            output.push(getOprand(inst, 1));
            pc += 2;
        },

    };

    while (memory[pc] != 99) {
        const inst = memory[pc];
        const op = inst % 100;
        
        if (pc + pcStep[op] >= input.length) {
            throw 'Not enough memory';
        }
        const act = actMap[op];
        if (!act) {
            throw 'Unknown operation';
        }
        act(inst);
    }
    return output;
};


const getThrusterSignal = (phases) => {
    let inputSignal = 0;

    for (const phase of phases) {
        const programOutput = run(memory.slice(), [phase, inputSignal]);
        if (programOutput.length != 1) {
            throw "Unexpected output length";
        }
        inputSignal = programOutput[0];
    }

    return inputSignal;
};

function *genPermutation (cur) {
    if (cur.length == 5) {
        yield cur;
        return;
    }
    for (let i = 0; i < 5; ++i) {
        if (cur.every(v => v != i)) {
            yield* genPermutation([...cur, i]);
        }
    }
}

let maxThrusterSignal = -Infinity;
for (const phases of genPermutation([])) {
    maxThrusterSignal = Math.max(maxThrusterSignal, getThrusterSignal(phases));
}
console.log(maxThrusterSignal);
