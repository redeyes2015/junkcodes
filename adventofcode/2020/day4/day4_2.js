
/*
byr (Birth Year) - four digits; at least 1920 and at most 2002.
iyr (Issue Year) - four digits; at least 2010 and at most 2020.
eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
hgt (Height) - a number followed by either cm or in:

    If cm, the number must be at least 150 and at most 193.
    If in, the number must be at least 59 and at most 76.

hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
pid (Passport ID) - a nine-digit number, including leading zeroes.
*/

function isFourDigits (s) {
    return /\d\d\d\d/.test(s)
}

function withinRange (v, l, h) {
    return v >= l && v <= h;
}

const EyeColors = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];

const validator = {
    byr: s => isFourDigits(s) && withinRange(parseInt(s, 10), 1920, 2002),
    iyr: s => isFourDigits(s) && withinRange(parseInt(s, 10), 2010, 2020),
    eyr: s => isFourDigits(s) && withinRange(parseInt(s, 10), 2020, 2030),
    hgt: s => (
        s &&
        (
            (s.endsWith("cm") && withinRange(parseInt(s.slice(0, -2), 10), 150, 193)) ||
            (s.endsWith("in") && withinRange(parseInt(s.slice(0, -2), 10), 59, 76))
        )
    ),
    hcl: s => /^#[0-9a-f]{6}$/.test(s),
    ecl: s => EyeColors.includes(s),
    pid: s => /^[0-9]{9}$/.test(s),
};

function assert(r) {
    if (!r) throw new Error("wrong!");
};

assert(validator.byr("1984"));
assert(!validator.byr("1900"));
assert(validator.byr("2002"));
assert(!validator.byr("2003"));
assert(validator.hgt("175cm"));
assert(!validator.hgt("abcde"));
assert(!validator.hgt("99in"));

const input = require("fs").readFileSync("input", "utf-8")
const lines = input.split("\n");

let validCount = 0;
let currentBook = new Map();

function isValid(keys) {
    return Object.entries(validator)
    .every(([k, test]) => test(keys.get(k)));
}

for (const l of lines) {
    if (l.length == 0) {
        if (isValid(currentBook)) {
            validCount += 1;
        }
        currentBook = new Map();
        continue;
    }
    l.split(" ")
    .filter(p => p.length > 0)
    .map(p => p.split(":"))
    .forEach(([k, v]) => currentBook.set(k, v));
}

if (isValid(currentBook)) {
    validCount += 1;
}

console.log(validCount);
