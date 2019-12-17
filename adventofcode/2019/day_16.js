'use strict';

//const input = '12345678';
//const input = '80871224585914546619083218645595';
//const input = '19617804207202209144916044189917';
//const input = '69317163492948606335995924319873';

const input = require('fs').readFileSync('./day_16.input', 'utf-8').trim();


function* repeatPattern (times) {
    for (const t of [0, 1, 0, -1]) {
        for (let i = 0; i < times; ++i) {
            yield t;
        }
    }
}

function* genVectorAtIndex (index) {
    const times = index + 1;
    const firstRound = repeatPattern(times);
    firstRound.next();
    yield* firstRound;

    while (true) {
        yield* repeatPattern(times);
    }
}

function* zip2 (a, b) {
    while (true) {
        const aNext = a.next();
        const bNext = b.next();
        if (bNext.done || aNext.done) {
            return;
        }
        yield [aNext.value, bNext.value];
    }
}

function* map (a, b, mapper) {
    for (const [aValue, bValue] of zip2(a, b)) {
        yield mapper(aValue, bValue);
    }
}

const takeN = (generator, N) => {
    const result = [];
    let c = 0;
    for (const t of generator) {
        result.push(t);
        c += 1;
        if (c >= N) {
            break;
        }
    }
    return result;
}

let signals = Array.from(input, c => parseInt(c, 0));
const length = input.length;

const round = (signal) => {
    return signal.map((_, i) => {
        const patternVector = genVectorAtIndex(i);
        const raw = takeN(map(signals.values(), patternVector, (a, b) => a * b), signal.length)
            .reduce((sum, v) => sum + v);
        return Math.abs(raw % 10);
    });
};


for (let i = 0; i < 100; ++i) {
    const nextSignals = round(signals);
    signals = nextSignals;
}
console.log(signals.slice(0, 8));
