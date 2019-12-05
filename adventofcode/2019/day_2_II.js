'use strict';

const fs = require('fs');

const input = fs.readFileSync('./day_2.input', 'utf-8');
const memory = input.split(',').map(t => parseInt(t, 10));

const run = (memory) => {
    let pc = 0;

    while (memory[pc] != 99) {
        if (pc + 3 >= input.length) {
            throw 'Not enough memory';
        }
        const actMap = {
            "1": (op1, op2) => op1 + op2,
            "2": (op1, op2) => op1 * op2,
        };
        const act = actMap[memory[pc]];
        if (!act) {
            throw 'Unknown operation';
        }
        const op1 = memory[memory[pc + 1]];
        const op2 = memory[memory[pc + 2]];

        memory[memory[pc + 3]] = act(op1, op2);

        pc += 4;
    }
    return memory[0];
};

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
