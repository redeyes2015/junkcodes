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
    let roundWinner;
    if (a <= as.length && b <= bs.length) {
        const { winner , cards } = game([as.slice(0, a), bs.slice(0, b)]);
        roundWinner = winner;
    } else {
        roundWinner = a > b ? 0 : 1;
    }
    return roundWinner == 0 ? [[...as, a, b], bs] : [as, [...bs, b, a]];
}
//console.log(round(parse(input)));

function game (players) {
    const seen = new Set();
    while (players.every(p => p.length > 0)) {
        //console.log(players);
        const key = players.map(p => p.join(',')).join('|');
        if (seen.has(key)) {
            return {
                winner: 0,
                cards: players[0],
            };
        }
        seen.add(key);
        players = round(players);
    }
    const winner = players.findIndex(p => p.length > 0);
    return {
        winner,
        cards: players[winner],
    };
}
let players = parse(input);
const endingCard = game(players).cards;
console.log(endingCard.reverse().reduce((sum, card, idx) => sum + card * (idx + 1), 0));

