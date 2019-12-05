'use strict';

const input = 36000000;

const plate = new Array(1000000);

const plateSize = plate.length;

plate[0] = plate[1] = false;
for (let i = 2; i < plateSize; ++i) {
  plate[i] = true;
}

const primes = [];

for (let i = 2; i < plateSize; ++i) {
  if (!plate[i]) {
    continue;;
  }
  primes.push(i);

  for (let j = i + i; j < plateSize; j += i) {
    plate[j] = false;
  }
}

const primesLen = primes.length;

function getFactorsSum (n) {
  const originN = n;
  let total = 1;

  primes.some(p => {
    if (p > n) {
      return true;
    }
    let subTotal = 1;
    let primeProduct = p;
    while (n % p == 0) {
      n /= p;
      subTotal += primeProduct;
      primeProduct *= p;
    }
    total *= subTotal;

    return n == 1;
  });

  if (n > 1) {
    throw originN;
  }
  return total;
}

let i = 100000;
let sum = getFactorsSum(i)
let checkPoint = i;
for (; sum * 10 < input; i += 1) {
  if (i >= checkPoint) {
    console.log('check', i);
    checkPoint = i + 1000;
  }
  sum = getFactorsSum(i);
}

console.log(i);

