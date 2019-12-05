'use strict';

const input_row = 3010;
const input_col = 3019;

const init = 20151125;
const multiplier = 252533;
const divider = 33554393;

function getDiagonIndex (row, col) {
  let result = 1;
  for (let i = 1; i < row; ++i) {
    result += i;
  }
  for (let i = 1; i < col; ++i) {
    result += row + i;
  }
  return result;
}

function getCode (init, idx) {
  /*
    let m = multiplier;
    let i = init;
    let d = divider;
    let t = idx - 1;
    let t = t1 + t2 + t3 + t4 + ...
      return (i * (m ^ t)) % d;
          == (i * ((m ^ t) % d) % d)
      and ((m ^ t) % d)
       == ((m ^ t1) * (m ^ t2) * (m ^ t3) * (m ^ t4) * ...) % d
       == (((m ^ t1) % d) * ((m ^ t2) % d) * ...) % d
    so making t1, t2, t3, ... be 2^n, where n is integer, should do the trick
  */
  let times = idx - 1;
  let mt = multiplier; // (m ^ t_i)
  let remainder = 1;
  for (let t = 1; t <= times; t *= 2) {
    if (times & t) {
      remainder = (remainder * mt) % divider;
    }
    mt = (mt * mt) % divider;
  }
  return (init * remainder) % divider;
}

console.log(getCode(init, getDiagonIndex(input_row, input_col)));
