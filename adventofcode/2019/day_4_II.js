"use strict";

const lower = 130254;
const upper = 678275;

const check = n => {
    let prev = 10;
    let currentStrip = 0;
    let hasExact2Strip = false;
    while (n > 0) {
        const d = n % 10;
        if (prev < d) {
            return false
        }
        if (prev == d) {
            currentStrip += 1;
        } else {
            if (currentStrip == 2) {
                hasExact2Strip = true
            }
            currentStrip = 1;
        }
        prev = d;
        n = (n - d) / 10;
    }
    return hasExact2Strip || currentStrip == 2;
};

[
    112233,
    123444,
    111122,
    334567,
].forEach(
    n => console.log(`${n} : ${check(n)}`)
);

let count = 0;

for (let guess = lower; guess <= upper; ++guess) {
    if (check(guess)) {
        count += 1;
    }
}

console.log(count);
