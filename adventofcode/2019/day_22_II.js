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
/*
const n = 10007;
const target = 2019;
const input = require('fs').readFileSync('./day_22.input', 'utf-8');
*/

// Part II
const n = 119315717514047;
const target = 2020;
const round = 101741582076661;
const input = require('fs').readFileSync('./day_22.input', 'utf-8');

const commands = input.split('\n').filter(l => l.length > 0);

class ModularArithmetic {
    constructor(n) {
        this.n = n;
    }
    add (a, b) {
        return (this.n + a + b) % this.n;
    }
    multiply (a, b) {
        const n = this.n;
        let sum = 0;
        let x = Math.max(a, b) % n;
        let times = Math.min(a, b);
        while (times > 0) {
            if (times % 2) {
                sum = (sum + x) % n;
            }
            times = (times - times % 2) / 2;
            x = (x + x) % n;
        }
        return sum;
    }
    power (a, b) {
        let prod = 1;
        while (b > 0) {
            if (b % 2) {
                prod = this.multiply(prod, a);
            }
            b = (b - b % 2) / 2;
            a = this.multiply(a, a);
        }
        return prod;
    }
    divide (a, b) {
        return this.multiply(a, this.inverse(b));
    }
    inverse (a) {
        // "Euler's theorem", assuming n is a prime.
        // See: https://en.wikipedia.org/wiki/Modular_multiplicative_inverse#Using_Euler's_theorem
        return this.power(a, this.n - 2);
    }
}

const gatherCoeffecient = (commands) => {
    let a = 1;
    let b = 0; // generate a formula of `a * i + b (MOD n)`
    for (const line of commands) {
        if (line == 'deal into new stack') {
            //index = n - 1 - index;
            a = n - a; // -a * x == (n - a) * x (MOD n)
            b = n - 1 - b;
            continue;
        }
        let match = /deal with increment (\d+)$/.exec(line);
        if (match) {
            //index = index * (parseInt(match[1])) % n;
            let c = parseInt(match[1], 10);
            a = (a * c) % n;
            b = (b * c) % n;
            continue;
        }
        match = /cut (-?\d+)$/.exec(line);
        if (match) {
            //index = (index - parseInt(match[1]) + n) % n;
            b = (b - parseInt(match[1], 10) + n)  % n;
            continue;
        }
        throw 'unknown command: ' + line;
    }
    return { a, b }
};

/*

f(x) = a * x + b;
f(f(x)) = a * (a * x + b) + b = a * a * x + a * b + b;
f^k(x) = (a ** k) * x + (a ** (k - 1)) * b + (a ** (k - 2)) * b + ... + a * b + b
       = (a ** k) * x + b * ((a ** k) - 1) / (a - 1);

reverse:

y = (a ** k) * x + b * ((a ** k) - 1) * inverse(a - 1);
(y - b * ((a ** k) - 1) / (a - 1)) / (a ** k) = x
*/

const inverseMutipleRound = (commands, round, target, modulo) => {
    const {a, b} = gatherCoeffecient(commands);

    const aRaiseRound = modulo.power(a, round);
    const aSeriesSum = modulo.divide(aRaiseRound - 1, a - 1);
    const bPart = modulo.multiply(b, aSeriesSum);

    return modulo.divide(modulo.add(target, -bPart), aRaiseRound);
}

const modulo = new ModularArithmetic(n);
console.log(inverseMutipleRound(commands, round, target, modulo));
