
'use strict';

const rl = require('readline').createInterface({
  input: process.stdin,
  terminal: false
});

const template = /^(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds\.\n?/;

const race_time = 2503;

const deers = {};

function getRange(deer, time) {
    const total_period = deer.total_period;
    const speed = deer.speed;
    const burst_time = deer.burst_time;
    return (Math.floor(time / total_period) * speed * burst_time
      + Math.min(burst_time, time % total_period) * speed);
}

rl.on('close', () => {
    const deer_names = Object.keys(deers);
    const deer_scores = {};
    const deer_pos = {};
    deer_names.forEach(n => deer_scores[n] = 0);
    for (let time = 1; time <= race_time; ++time) {
      let max = 0;
      deer_names.forEach(n => {
        deer_pos[n] = getRange(deers[n], time);
        if (max < deer_pos[n]) {
          max = deer_pos[n];
        }
      });
      deer_names.forEach(n =>
        deer_scores[n] += (deer_pos[n] == max ? 1 : 0)
      );
    }
    deer_names.forEach(n => console.log(n, deer_scores[n]));
    deer_names.map(n => deer_scores[n])
      .reduce((acc, s) => Math.max(acc, s), 0);
  })
  .on('line', line => {
    const result = template.exec(line);
    const name = result[1];
    const burst_time = Number(result[3]);
    const rest_time = Number(result[4]);

    deers[name] = {
      speed: Number(result[2]),
      burst_time: burst_time,
      rest_time: rest_time,
      total_period: burst_time + rest_time
    };
  });

