const _input = `Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10`
const input = require("fs").readFileSync("input", "utf-8");

function parse(input) {
    return input.split("\n\n").slice(0, 2).map(p => {
        const lines = p.split("\n").filter(l => l.length > 0);
        return lines.slice(1).map(s => parseInt(s, 10));
    });
};

function round(players) {
    const [ [a, ...as], [b, ...bs] ] = players;
    if (a > b) {
        return [[...as, a, b], bs];
    } else {
        return [as, [...bs, b, a]];
    }
}
//console.log(round(parse(input)));

let players = parse(input);
while (players.every(p => p.length > 0)) {
    //console.log(players);
    players = round(players);
}
const winner = players.find(p => p.length > 0);
console.log(winner.reverse().reduce((sum, card, idx) => sum + card * (idx + 1), 0));

