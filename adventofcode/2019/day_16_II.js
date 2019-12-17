'use strict';

//const input = '03036732577212944063491565474664';
//const input = '02935109699940807407585447034323';

const input = require('fs').readFileSync('./day_16.input', 'utf-8').trim();


let signals = Array.from(input, c => parseInt(c, 0));

const round = (signals) => {
    const length = signals.length;
    const reverseAcc = Array.from({length:signals});

    reverseAcc[length - 1] = signals[length - 1]
    for (let i = length - 2; i >= 0; --i) {
        reverseAcc[i] = signals[i] + reverseAcc[i + 1];
    }
    return signals.map((_, index) => {
        let raw = 0;

        const repeat = index + 1;
        let offset = -1;

        while (offset < length) {
            offset += repeat;
            if (offset < length) {
                raw += reverseAcc[offset]
            }

            offset += repeat;
            if (offset < length) {
                raw -= reverseAcc[offset]
            }

            offset += repeat;
            if (offset < length) {
                raw -= reverseAcc[offset]
            }

            offset += repeat;
            if (offset < length) {
                raw += reverseAcc[offset]
            }
        }

        return Math.abs(raw % 10);
    });
};

// part I
/*
for (let i = 0; i < 100; ++i) {
    const nextSignals = round(signals);
    signals = nextSignals;
}
console.log(signals.slice(0, 8));
*/

// part II
/*
signals = Array.from({length: 10000}, () => signals.slice()).flat();
console.log(`input length: ${input.length} | signal length: ${signals.length}`);
for (let i = 0; i < 100; ++i) {
    const nextSignals = round(signals);
    signals = nextSignals;
}

const skip = parseInt(input.slice(0, 7), 10);
console.log(skip);
console.log(signals.slice(skip, skip + 8));
*/

// part II trick version...
const skip = parseInt(input.slice(0, 7), 10);
signals = Array.from({length: 10000}, () => signals.slice()).flat();
console.log(`skip: ${skip} ; signals.length: ${signals.length}`);

if (skip < signals.length / 2) {
    throw "trick not apply-able";
}
signals = signals.slice(skip);
for (let round = 0; round < 100; ++round) {
    let prev = 0;
    for (let i = signals.length - 1; i >= 0; --i) {
        prev = (prev + signals[i]) % 10;
        signals[i] = prev;
    }
}

console.log(signals.slice(0, 8));
