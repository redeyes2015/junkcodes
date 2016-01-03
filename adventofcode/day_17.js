'use strict';

//const bins = [20, 15, 10, 5, 5].sort((a, b) => a - b);
const bins = [43, 3, 4, 10, 21, 44,
      4, 6, 47, 41, 34, 17,
      17, 44, 36, 31, 46, 9,
      27, 38
  ].sort((a, b) => a - b);
//const eggnog = 25;
const eggnog = 150;

let combination_cnt = 0;

function recurs (used_bins, left_eggnog, unused_bins) {
  if (left_eggnog == 0) {
    //console.log(used_bins);
    combination_cnt += 1;
    return;
  }

  unused_bins.filter(bin => bin <= left_eggnog)
    .forEach((bin, idx) => {
      recurs(used_bins.concat(bin), left_eggnog - bin,
         unused_bins.slice(idx + 1))
    });
}

recurs([], eggnog, bins);
console.log(combination_cnt);
