'use strict';

const inputs = require('fs').readFileSync('day_23.input', {encoding: 'ascii'}).split('\n');

const instructions = {
  hlf: (l, stats) => {
    stats.regs[l[4]] /= 2;
    stats.pc += 1;
  },
  tpl: (l, stats) => {
    stats.regs[l[4]] *= 3;
    stats.pc += 1;
  },
  inc: (l, stats) => {
    stats.regs[l[4]] += 1;
    stats.pc += 1;
  },
  jmp: (l, stats) => {
    stats.pc += (Number(l.slice(4)));
  },
  jie: (l, stats) => {
    if ((stats.regs[l[4]] & 1) == 0) {
      stats.pc += (Number(l.slice(7)));
    }
    else {
      stats.pc += 1;
    }
  },
  jio: (l, stats) => {
    if (stats.regs[l[4]]  == 1) {
      stats.pc += (Number(l.slice(7)));
    }
    else {
      stats.pc += 1;
    }
  }
};

const theStats = {
  regs: {
    a: 1,
    b: 0,
  },
  pc: 0
};

while (true) {
  let line = inputs[theStats.pc];
  if (!line) {
    break;
  }
  const inst = line.slice(0, 3);
  console.log('inst', inst);
  instructions[inst](line, theStats);
}

console.log(JSON.stringify(theStats, null, "  "));
