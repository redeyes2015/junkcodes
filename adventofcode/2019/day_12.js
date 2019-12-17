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

class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    get absSum () {
        return ["x", "y", "z"]
            .map((axis) => Math.abs(this[axis]))
            .reduce((sum, v) => sum + v, 0);
    }
}

class Moon {
    constructor(initPosition, velocity = new Vector(0, 0, 0)) {
        this.pos = initPosition;
        this.velocity = velocity;
    }

    applyGravity (otherMoon) {
        ["x", "y", "z"].forEach((axis) => {
            if (this.pos[axis] > otherMoon.pos[axis]) {
                this.velocity[axis] -= 1;
            } else if (this.pos[axis] < otherMoon.pos[axis]) {
                this.velocity[axis] += 1;
            }
        });
    }
    applyVelocity () {
        ["x", "y", "z"].forEach((axis) => {
            this.pos[axis] += this.velocity[axis]
        });
    }
    get potentialEnergy () {
        return this.pos.absSum;
    }
    get kineticEnergy () {
        return this.velocity.absSum;
    }
    get totalEnergy () {
        return this.potentialEnergy * this.kineticEnergy;
    }
}

const lineToVector = (line) => {
    const {x, y, z} = /^<x=(?<x>-?\d+), y=(?<y>-?\d+), z=(?<z>-?\d+)>$/.exec(line).groups;
    return new Vector(parseInt(x, 10), parseInt(y, 10), parseInt(z, 10));
}

const moons = input.split('\n').map(line => new Moon(lineToVector(line)));
console.log(moons);

const oneTimestep = () => {
    for (const moon1 of moons) {
        for (const moon2 of moons) {
            if (moon1 == moon2) {
                continue;
            }
            moon1.applyGravity(moon2);
        }
    }
    for (const moon of moons) {
        moon.applyVelocity();
    }
};

for (let i = 0; i < 1000; ++i) {
    oneTimestep();
}

console.log(moons);
console.log(moons.map(m => m.totalEnergy).reduce((sum, e) => sum + e, 0));


