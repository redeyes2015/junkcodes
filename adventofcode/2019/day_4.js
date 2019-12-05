"use strict";

const nines = [99999, 9999, 999, 99, 9, 0];

//const guess = [1,3,0,2,5,4];
//const upper = [6,7,8,2,7,5];

const lower = 130254;
const upper = 678275;

let count = 0;

let i = 0;

const check = n => {
    let hasAdjDupe = false;
    let prev = 10;
    while (n > 0) {
        const d = n % 10;
        if (prev == d) {
            hasAdjDupe = true;
        }
        if (prev < d) {
            return false
        }
        prev = d;
        n = (n - d) / 10;
    }
    return hasAdjDupe;
};

for (let guess = lower; guess <= upper; ++guess) {
    if (check(guess)) {
        count += 1;
    }
}

console.log(count);

