const input = require('fs').readFileSync('./day_19.input', 'utf-8');
const _input = `42: 9 14 | 10 1
9: 14 27 | 1 26
10: 23 14 | 28 1
1: "a"
11: 42 31
5: 1 14 | 15 1
19: 14 1 | 14 14
12: 24 14 | 19 1
16: 15 1 | 14 14
31: 14 17 | 1 13
6: 14 14 | 1 14
2: 1 24 | 14 4
0: 8 11
13: 14 3 | 1 12
15: 1 | 14
17: 14 2 | 1 7
23: 25 1 | 22 14
28: 16 1
4: 1 1
20: 14 14 | 1 15
3: 5 14 | 16 1
27: 1 6 | 14 18
14: "b"
21: 14 1 | 1 14
25: 1 1 | 1 14
22: 14 14
8: 42
26: 14 22 | 1 20
18: 15 15
7: 14 5 | 1 21
24: 14 1

abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
bbabbbbaabaabba
babbbbaabbbbbabbbbbbaabaaabaaa
aaabbbbbbaaaabaababaabababbabaaabbababababaaa
bbbbbbbaaaabbbbaaabbabaaa
bbbababbbbaaaaaaaabbababaaababaabab
ababaaaaaabaaab
ababaaaaabbbaba
baabbaaaabbaaaababbaababb
abbbbabbbbaaaababbbbbbaaaababb
aaaaabbaabaaaaababaa
aaaabbaaaabbaaa
aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
babaaabbbaaabaababbaabababaaab
aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba`;


const [rules, strs] = input.split("\n\n").map(section => section.split("\n").filter(l => l.length > 0));

rules.push('8: 42 | 42 8', '11: 42 31 | 42 11 31');

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

function check (s, remaining, visited) {
    if (remaining.length == 0) {
        return s.length == 0;
    }
    if (remaining.length > s.length) {
        return false;
    }
    const visitedKey = `${s} ${remaining.join(',')}`;
    if (visited.has(visitedKey)) {
        return false;
    }
    visited.add(visitedKey);
    const [patKey, ...rest] = remaining;
    const patterns = ruleSet.get(patKey);
    if (typeof patterns == 'string') {
        if (s[0] == patterns) {
            return check(s.slice(1), rest, visited);
        } else {
            return false;
        }
    }
    return patterns.some(pat => check(s, [...pat,  ...rest], visited));
}

console.log(strs.filter(s => check(s, ['0'], new Set())).length);
