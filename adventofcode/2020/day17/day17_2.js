
const initial = `.#.
..#
###`;

function parseInit (text) {
    const activePoints = new Set();
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; ++i) {
        const line = lines[i];
        for (let j = 0; j < line.length; ++j) {
            if (line[j] == '#') {
                activePoints.add(`${i},${j},0,0`)
            }
        }
    }
    return activePoints;
}

//console.log([...parseInit(initial)]);

function genNeighbor (index) {
    const [x, y, z, w] = index.split(",").map(s => parseInt(s, 10));
    const ns = [];
    for (const dx of [-1, 0, 1]) {
        for (const dy of [-1, 0, 1]) {
            for (const dz of [-1, 0, 1]) {
                for (const dw of [-1, 0, 1]) {
                    if ([dx, dy, dz, dw].some(d => d != 0)) {
                        ns.push([x + dx, y + dy, z + dz, w + dw].join(","));
                    }
                }
            }
        }
    }
    return ns;
}

//console.log(genNeighbor(`0,0,0,0`).length);

function cycle(points) {
    const neighborActive = new Map();

    for (const p of points) {
        for (const n of genNeighbor(p)) {
            const c = (neighborActive.get(n) || 0) + 1;
            neighborActive.set(n, c);
        }
    }
    const newPoints = new Set();
    for (const p of points) {
        const c = neighborActive.get(p) || 0;
        if (c == 2 || c == 3) {
            newPoints.add(p);
        }
    }
    for (const [p, c] of neighborActive) {
        if (!points.has(p) && c == 3) {
            newPoints.add(p);
        }
    }

    return newPoints;
}

let points = parseInit(initial);
for (let i = 0; i < 6; ++i) {
    points = cycle(points);
}

//console.log([...points]);
console.log(points.size);
