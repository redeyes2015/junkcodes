const input = require('fs').readFileSync('./day_19.input', 'utf-8');
const _input = `0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb`;


const [rules, strs] = input.split("\n\n").map(section => section.split("\n").filter(l => l.length > 0));

function parseRules (rules) {
    return new Map(rules.map(line => {
        const [key, pattern] = line.split(": ");
        if (/"(a|b)"/.test(pattern)) {
            return [key, pattern[1]];
        }
        return [key, pattern.split(" | ").map(p => p.split(" "))];
    }));
}

function getCount (id, ruleMap, countMap) {
    if (countMap.has(id)) {
        return countMap.get(id);
    }
    const pattern = ruleMap.get(id);
    if (pattern === "a" || pattern === "b") {
        countMap.set(id, 1);
        return 1;
    }
    const count = pattern.map((concat) => {
        return concat.reduce((product, id) => product * getCount(id, ruleMap, countMap), 1)
    }).reduce((sum, c) => sum + c, 0);
    countMap.set(id, count);
    return count;
}

const ruleSet = parseRules(rules);
//console.log(getCount('0', parseRules(rules), new Map()));

//strs.sort();

function check (s, remaining) {
    if (s.length == 0 && remaining.length == 0) {
        return true;
    }
    if (s.length == 0 || remaining.length == 0) {
        return false;
    }
    const [patKey, ...rest] = remaining;
    const patterns = ruleSet.get(patKey);
    if (typeof patterns == 'string') {
        if (s[0] == patterns) {
            return check(s.slice(1), rest);
        } else {
            return false;
        }
    }
    return patterns.some(pat => check(s, [...pat,  ...rest]));
}

console.log(strs.filter(s => check(s, ['0'])).length);
