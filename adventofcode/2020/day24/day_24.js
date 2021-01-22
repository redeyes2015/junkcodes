
const input = require('fs').readFileSync('day_24.input', 'utf-8');
const _input = `sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew`

const vectors = {
    e: [2, 0],
    se: [1, -1],
    ne: [1, 1],
    w: [-2, 0],
    sw: [-1, -1],
    nw: [-1, 1],
};

function consumeLine(map, line) {
    const point = [0, 0];
    for (let i = 0; i < line.length; ++i) {
        let vec
        if (line[i] == 'e' || line[i] == 'w') {
            vec = vectors[line[i]];
        } else {
            vec = vectors[line.slice(i, i + 2)];
            i += 1;
        }
        point[0] += vec[0];
        point[1] += vec[1];
    }
    //console.log(point);
    const key = point.join(',');
    map.set(key, !map.get(key));
}

//consumeLine(new Map(), 'nwwswee');

function solve(input) {
    const map = new Map();
    for (const line of input.split('\n')) {
        if (line.length == 0) {
            continue;
        }
        consumeLine(map, line);
    }
    let count = 0;
    for (const side of map.values()) {
        if (side) {
            count += 1;
        }
    }
    return count;
}

console.log(solve(input));
