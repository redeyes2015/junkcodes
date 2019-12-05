'use strict';

const alpha = "abcdefghijklmnopqrstuvwxyz";

const alpha_len = alpha.length;

const forbidden = "iol";

const forbidden_idx = forbidden.split("").map(c => alpha.indexOf(c));

function next(idx) {
  const l = idx.length;
  let i = l - 1;
  let carry = 1;
  for (; carry > 0 && i >= 0; --i) {
    idx[i] += 1;
    if (idx[i] >= alpha_len) {
      idx[i] = 0;
      carry = 1;
    }
    else {
      carry = 0;
    }
  }
  if (carry != 0) {
    throw "Overflow!";
  }
  for (i = 0; i < l; ++i) {
    if (forbidden_idx.indexOf(idx[i]) >= 0) {
      idx[i] += 1;
      for (++i; i < l; ++i) {
        idx[i] = 0;
      }
      break;
    }
  }
}

function test_inc_3(idx) {
  const l = idx.length;
  for (let i = 2; i < l; ++i) {
    if (idx[i] == idx[i - 1] + 1 && idx[i] == idx[i - 2] + 2) {
      return true;
    }
  }
  return false;
}

function test_pairs(idx) {
  const l = idx.length;
  let count = 0;
  let i = l - 1;

  while (i > 0) {
    if (idx[i] == idx[i - 1]) {
      if (count > 0) {
        return true;
      }
      count += 1;
      i -= 1;
    }
    i -= 1;
  }

  return false;
}

let current_pwd_s = "vzbxkghb";
//let current_pwd_s = "vzbxxyzz";

let current_pwd_idx = current_pwd_s.split("").map(c => alpha.indexOf(c));

let found = false;


while (!found) {
  next(current_pwd_idx);

  found = test_inc_3(current_pwd_idx) && test_pairs(current_pwd_idx);
}

console.log(current_pwd_idx.map(i => alpha[i]).join(""));


