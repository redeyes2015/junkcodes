'use strict';

/*
const n = 10;
const target = 8;
const input = `deal into new stack
cut -2
deal with increment 7
cut 8
cut -4
deal with increment 7
cut 3
deal with increment 9
deal with increment 3
cut -1`;
//Result: 9 2 5 8 1 4 7 0 3 6
*/

// Part I
const n = 10007;
const target = 2019;
const input = require('fs').readFileSync('./day_22.input', 'utf-8');

const commands = input.split('\n').filter(l => l.length > 0);

const shuffleFrom = (index) => {
    for (const line of commands) {
        if (line == 'deal into new stack') {
            index = n - 1 - index;
            continue;
        }
        let match = /deal with increment (\d+)$/.exec(line);
        if (match) {
            index = index * (parseInt(match[1])) % n;
            continue;
        }
        match = /cut (-?\d+)$/.exec(line);
        if (match) {
            index = (index - parseInt(match[1]) + n) % n;
            continue;
        }
        throw 'unknown command: ' + line;
    }
    return index;
};


console.log(shuffleFrom(2019));
