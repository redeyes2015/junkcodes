
const _input = '389125467';
const input = '253149867';

function round (state) {
    const [current, p1, p2, p3, ...rest] = state;
    let dest = current - 1;
    while (!rest.includes(dest)) {
        if (dest == 0) {
            dest = rest.reduce((a, b) => Math.max(a, b), 0);
        } else {
            dest -= 1;
        }
    }
    const destIdx = rest.indexOf(dest);

    return [...(destIdx > 0 ? rest.slice(0, destIdx) : []), dest, p1, p2, p3, ...rest.slice(destIdx + 1), current];
}
//console.log(round(Array.from(input, c => parseInt(c, 10))));

let state = Array.from(input, c => parseInt(c, 10));
for (let i = 0; i < 100; ++i) {
    //console.log(state);
    state = round(state);
}

const dup = state.join('') + state.join('');
const oneIdx = dup.indexOf('1');

console.log(dup.slice(oneIdx + 1, oneIdx + 9));
