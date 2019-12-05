'use strict';

//const input = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11];
const input = [ 1, 3, 5, 11, 13,
  17, 19, 23, 29, 31,
  41, 43, 47, 53, 59,
  61, 67, 71, 73, 79,
  83, 89, 97, 101, 103,
  107, 109, 113,
];

const takeSum = arr => arr.reduce((acc, x) => acc + x, 0);
const takeProd = arr => arr.reduce((acc, x) => acc * x, 1);

const sum = takeSum(input);
const subSum = sum / 4;
const input_l = input.length;

function genCombination (list, n, check) {
  const list_l = list.length;
  const v = new Array(n);
  let letsBreak = false;

  (function recurs(start, pos) {
    if (pos == n) {
      let vector = [];
      let unused = [];
      list.forEach((x, idx) => {
        if (v.indexOf(idx) >= 0) {
          vector.push(x);
        }
        else {
          unused.push(x);
        }
      });
      if (true === check(vector, unused)) {
        letsBreak = true;
      }
      return;
    }

    for (let i = start; i < list_l; ++i) {
      v[pos] = i;
      recurs(i + 1, pos + 1);
      if (letsBreak) {
        break;
      }
    }
  })(0, 0);
}


function checkGroup234 (input) {
  const maxi = input.length - 2;
  let found = false;
  for (let i = 1; !found && i <= maxi; ++i) {
    genCombination(input, i, (grp2, unused) => {
      if (takeSum(grp2) != subSum) {
        return;
      }
      found = checkGroup34(unused);
      return found;
    });
  }
  return found;
}

function checkGroup34 (input) {
  const maxi = Math.floor(input.length / 2);
  let found = false;
  for (let i = 1; !found && i <= maxi; ++i) {
    genCombination(input, i, (grp3, grp4) => {
      if (takeSum(grp3) != subSum || takeSum(grp4) != subSum) {
        return;
      }
      found = true;
      return true;
    });
  }
  return found;
}

(function pickGroup1 (input) {
  let found = false;
  let bestVector = null;
  let minProd = Number.POSITIVE_INFINITY;
  const maxi = input_l - 3;
  for (let i = 1; !found && i <= maxi; ++i) {
    genCombination(input, i, (vec, unused) => {
      if (takeSum(vec) != subSum ||
          !checkGroup234(unused)) {
        return;
      }
      const thisProd = takeProd(vec);
      if (bestVector == null || minProd > thisProd) {
        found = true;
        minProd = thisProd;
        bestVector = vec;
        console.log(minProd, vec);
      }
    });
  }
  console.log('answer:', minProd, bestVector);
})(input);
