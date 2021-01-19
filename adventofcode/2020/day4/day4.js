
const required = [
    "byr",
    "iyr",
    "eyr",
    "hgt",
    "hcl",
    "ecl",
    "pid",
    //"cid",
];
/*
byr (Birth Year)
    iyr (Issue Year)
    eyr (Expiration Year)
    hgt (Height)
    hcl (Hair Color)
    ecl (Eye Color)
    pid (Passport ID)
    cid (Country ID)
    */

const input = require("fs").readFileSync("input", "utf-8")
const lines = input.split("\n");

let validCount = 0;
let currentKeys = new Set();

function isValid(keys) {
    return required.every(k => keys.has(k));
}

for (const l of lines) {
    if (l.length == 0) {
        if (isValid(currentKeys)) {
            validCount += 1;
        }
        currentKeys = new Set();
        continue;
    }
    l.split(" ")
    .filter(p => p.length > 0)
    .map(p => p.split(":")[0])
    .forEach(k => currentKeys.add(k));
}

if (isValid(currentKeys)) {
    validCount += 1;
}

console.log(validCount);
