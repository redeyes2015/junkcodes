const lines = require('fs').readFileSync('./day_5.input', 'utf-8').split('\n');


const getSeatID = (s) => {
    const row_s = Array.from(s.slice(0, 7), c => c == 'B' ? 1 : 0).join('');
    const col_s = Array.from(s.slice(7, 10), c => c == 'R' ? 1 : 0).join('');

    return parseInt(row_s + col_s, 2);
};

//getSeatID("BFFFBBFRRR");//: row 70, column 7, seat ID 567.
//getSeatID("FFFBBBFRRR");// row 14, column 7, seat ID 119.
//getSeatID("BBFFBBFRLL");// row 102, column 4, seat ID 820.


// part I
/*
let maxId = 0;

for (const l of lines) {
    if (l.length < 1) {
        continue;
    }
    maxId = Math.max(maxId, getSeatID(l));
}
console.log(maxId);
*/

// part II
const seen = new Set();
let maxId = 0;
let minId = 1000;

for (const l of lines) {
    if (l.length < 1) {
        continue;
    }
    const id = getSeatID(l);
    seen.add(id);
    maxId = Math.max(maxId, id);
    minId = Math.min(minId, id);
}

for (let id = minId + 1; id < maxId; ++id) {
    if (seen.has(id - 1) && !seen.has(id) && seen.has(id + 1)) {
        console.log(id);
    }
}
