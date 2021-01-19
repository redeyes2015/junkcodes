//const input = require('fs').readFileSync('input.test', 'utf-8');
const input = require('fs').readFileSync('input', 'utf-8');

function revers(s) {
    return Array.from(s).reverse().join('');
}
function isSameEdge (a, b) {
    return a == b || reverse(a) == b;
}

function genEdges(tile) {
    return [
        tile[0],
        tile.map(r => r[r.length - 1]).join(''),
        Array.from(tile[tile.length - 1]).reverse().join(''),
        tile.map(r => r[0]).reverse().join(''),
    ];
}

function parse (input) {
    const sections = input.split('\n\n').filter(s => s.length > 0);
    return new Map(sections.map(sect => {
        const lines = sect.split('\n').filter(l => l.length > 0);
        const edges = genEdges(lines.slice(1));
        return [lines[0].slice(5, -1), edges];
    }));
}

//console.log([...parse(input).keys()]);

function edgeToTiles (tileMap) {
    const e2T = new Map();
    for (const [id, edges] of tileMap) {
        for (const [idx, e] of edges.entries()) {
            let tileSet = e2T.get(e) || e2T.get(revers(e));
            if (!tileSet) {
                tileSet = new Set();
                e2T.set(e, tileSet);
            }
            tileSet.add(`${id}-${idx}${e2T.has(e) ? '' : 'r'}`);
        }
    }
    return e2T;
}

//console.log([...edgeToTiles(parse(input)).values()]);

function getNeighborCount (edges, e2T) {
    return edges.filter(e => (e2T.get(e) || e2T.get(revers(e))).size > 1).length;
}

function solve (input) {
    const tilesMap = parse(input);
    const e2T = edgeToTiles(tilesMap);

    let result = 1;
    for (const [id, edges] of tilesMap) {
        const c = getNeighborCount(edges, e2T);
        if (c == 2) {
            console.log(id);
            result *= parseInt(id, 10);
        }
        if (c == 0 || c > 4) {
            throw new Error("wrong!" + c);
        }
    }
    return result;
}

console.log(solve(input));

