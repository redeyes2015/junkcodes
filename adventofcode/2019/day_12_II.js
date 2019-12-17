"use strict";

/*
const input = `<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`
*/

/*
const input = `<x=-8, y=-10, z=0>
<x=5, y=5, z=10>
<x=2, y=-7, z=3>
<x=9, y=-8, z=-3>`;
*/

const input = `<x=3, y=-6, z=6>
<x=10, y=7, z=-9>
<x=-3, y=-7, z=9>
<x=-8, y=0, z=4>`

const parseLine = (line) => {
    const {x, y, z} = /^<x=(?<x>-?\d+), y=(?<y>-?\d+), z=(?<z>-?\d+)>$/.exec(line).groups;

    return {
        x: parseInt(x, 10),
        y: parseInt(y, 10),
        z: parseInt(z, 10),
    };
}

const initialPositions = input.split('\n').map(line => parseLine(line));
console.log(initialPositions);

const findLoop = (initialPositions, axis) => {
    const posVector = initialPositions.map((pos) => pos[axis]);
    const velVector = initialPositions.map(() => 0);
    const count = posVector.length;

    const stateMap = new Map();
    const toStateKey = (pos, vel) => `${posVector.join(',')}|${velVector.join('.')}`;

    let step = 0;
    while (true) {
        const stateKey = toStateKey(posVector, velVector);
        if (stateMap.has(stateKey)) {
            console.log('matched!');
            console.log(`previous step: ${stateMap.get(stateKey)}, current: ${step}`);
            return step;
        }
        stateMap.set(toStateKey(posVector, velVector), step);
        for (let i = 0; i < count; ++i) {
            for (let j = i + 1; j < count; ++j) {
                if (posVector[i] < posVector[j]) {
                    velVector[i] += 1;
                    velVector[j] -= 1;
                } else if (posVector[i] > posVector[j]) {
                    velVector[i] -= 1;
                    velVector[j] += 1;
                }
            }
        }
        for (let i = 0; i < count; ++i) {
            posVector[i] += velVector[i];
        }
        step += 1;
    }

};

const GCD = (a, b) => {
    let [top, below] = [ Math.min(a, b), Math.max(a, b) ];

    while (below > 1) {
        let mod = top % below;
        if (mod == 0) {
            return below;
        }
        [top, below] = [below, mod];
    }

    return 1;
};

const LCM = (x, ...xs) => {
    if (xs.length == 1) {
        return x * xs[0] / GCD(x, xs[0]);
    }
    return LCM(x, LCM(...xs));
};

console.log(LCM(
    findLoop(initialPositions, 'x'),
    findLoop(initialPositions, 'y'),
    findLoop(initialPositions, 'z'),
));
