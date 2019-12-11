'use strict';

const fs = require('fs');

const input = fs.readFileSync('./day_7.input', 'utf-8');
//const input = "3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10";

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

class Amplifier {
    constructor(memory, phase) {
        this.memory = memory;
        this.inputQueue = [phase];
        this.outputQueue = [];
        this.pc = 0;

        this.actMap = {
            "1": (inst) => this.triOpAct(inst, (a, b) => a + b),
            "2": (inst) => this.triOpAct(inst, (a, b) => a * b),
            "7": (inst) => this.triOpAct(inst, (a, b) => a < b ? 1 : 0),
            "8": (inst) => this.triOpAct(inst, (a, b) => a == b ? 1 : 0),

            "5": (inst) => this.jumpAct(inst, v => v != 0),
            "6": (inst) => this.jumpAct(inst, v => v == 0),

            "3": (inst) => {
                if (this.inputQueue.length <= 0) {
                    throw 'Input stack empty';
                }
                //console.log(`Writing ${this.inputQueue[0]} to ${memory[this.pc + 1]}`);
                memory[memory[this.pc + 1]] = this.inputQueue.shift();
                this.pc += 2;
            },
            "4": (inst) => {
                this.outputQueue.push(this.getOprand(inst, 1));
                this.pc += 2;
            },

        };

    }
    get halted () {
        return this.memory[this.pc] == 99;
    }
    getOprand (inst, pos) {
        const val = this.memory[this.pc + pos];
        pos = 10 * (10 ** pos);
        if (Math.floor(inst / pos) % 10 == 1) {
            return val; // immediate mode
        }
        return this.memory[val];
    }
    triOpAct (inst, act) {
        this.memory[this.memory[this.pc + 3]] = act(this.getOprand(inst, 1), this.getOprand(inst, 2));
        this.pc += 4;
    }
    jumpAct (inst, predic) {
        if (predic(this.getOprand(inst, 1))) {
            this.pc = this.getOprand(inst, 2);
        } else {
            this.pc += 3;
        }
    }
    run (input) {
        if (this.halted) {
            return;
        }
        this.inputQueue.push(input);

        //console.log(`run: inputQueue: ${this.inputQueue}`);

        while (this.memory[this.pc] != 99) {
            const inst = this.memory[this.pc];
            const op = inst % 100;

            if (this.pc + pcStep[op] >= input.length) {
                throw 'Not enough memory';
            }
            const act = this.actMap[op];
            if (!act) {
                throw `Unknown operation: ${op} @ ${this.pc}`;
            }
            try {
                act(inst);
            } catch (e) {
                if (e == 'Input stack empty') {
                    return;
                }
                throw e;
            }
        }
    };
    getNextOutput () {
        if (this.outputQueue.length <= 0) {
            throw "No next output available"
        }
        return this.outputQueue.shift();
    }
}

const getThrusterSignal = (phases) => {
    const amps = phases.map(p => new Amplifier(memory.slice(), p));
    let inputSignal = 0;

    while (!amps[0].halted) {
        for (const [index, amp] of amps.entries()) {
            //console.log(`Run amplifier #${index}, with input ${inputSignal}`);
            amp.run(inputSignal);
            //console.log(`After run: ${amp.memory}`);
            inputSignal = amp.getNextOutput();
        }
    }

    return inputSignal;
};

function *genPermutation (cur) {
    if (cur.length == 5) {
        yield cur;
        return;
    }
    for (let i = 5; i < 10; ++i) {
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

