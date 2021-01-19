function round (state, current, max) {
    const p1 = state[current];
    const p2 = state[p1];
    const p3 = state[p2];
    state[current] = state[p3];
    
    let dest = current - 1;
    const pickuped = [p1, p2, p3];
    while (dest == 0 || pickuped.includes(dest)) {
        if (dest == 0) {
            dest = max;
        } else {
            dest -= 1;
        }
    }

    state[p3] = state[dest];
    state[dest] = p1;

    return state[current];
}

function solve(input, max, repeat) {
    const state = Array.from({length: max + 1}, _ => 0);
    const firstCurrent = parseInt(input[0], 10);
    let prev = firstCurrent;
    for (let i = 1; i < input.length; ++i) {
        const current = parseInt(input[i], 10);
        state[prev] = current;
        prev = current;
    }
    if (max > input.length) {
        state[prev] = input.length + 1;
        for (let i = input.length + 1; i < max; ++i) {
            state[i] = i + 1;
        }
        prev = max;
    }
    state[prev] = firstCurrent;

    let current = firstCurrent;
    for (let i = 0; i < repeat; ++i) {
        //console.log(state);
        current = round(state, current, max);
    }
    //console.log(state);

    console.log(state[1], state[state[1]]);
    console.log(state[1] * state[state[1]]);
}

const input = '389125467';

//solve(input, 9, 1e2);
//solve(input, 20, 2);
solve(input, 1e6, 1e7);
