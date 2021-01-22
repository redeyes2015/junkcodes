
// const [a, b] = [5764801, 17807724];
const [a, b] = [ 1327981, 2822615 ];

function findLoopSize (n) {
    let e = 1;
    for (let i = 1; i < 10000000; ++i) {
        e = e * 7 % 20201227;
        if (e == n) {
            return i;
        }
    }
    return -1;
}

const ai = findLoopSize(a);
const bi = findLoopSize(b);

function powMod(b, r) {
    let n = 1;
    for (let i = 0; i < r; ++i) {
        n = n * b % 20201227;
    }
    return n;
}

console.log(powMod(a, bi));
console.log(powMod(b, ai));
console.log(powMod(7, ai + bi - 1));
console.log(powMod(7, ai + bi));
console.log(powMod(7, 1 + ai + bi));
console.log(powMod(7, 2 + ai + bi));
