'use strict';

const bossStat = {
  hp: 109,
  damage: 8,
  armor: 2
};

const weaponLines = `Dagger        8     4       0
  Shortsword   10     5       0
  Warhammer    25     6       0
  Longsword    40     7       0
  Greataxe     74     8       0`;

const armorLines = `Leather      13     0       1
  Chainmail    31     0       2
  Splintmail   53     0       3
  Bandedmail   75     0       4
  Platemail   102     0       5
  foo           0     0       0`;

const ringLines = `Damage+1    25     1       0
  Damage+2    50     2       0
  Damage+3   100     3       0
  Defense+1   20     0       1
  Defense+2   40     0       2
  Defense+3   80     0       3
  foo1         0     0       0
  foo2         0     0       0`;

function parse(lines) {
  return lines.split("\n")
    .map(line => line.trim().split(/ +/))
    .map(lineParts => ({
      name: lineParts[0],
      cost: Number(lineParts[1]),
      damage: Number(lineParts[2]),
      armor: Number(lineParts[3])
    }));
}

var weapons = parse(weaponLines);
var armors = parse(armorLines);
var rings = parse(ringLines);

function pickWeapon (equips, check) {
  weapons.forEach(weapon => pickArmor(equips.concat(weapon), check));
}

function pickArmor (equips, check) {
  armors.forEach(armor => pickRings(equips.concat(armor), check));
}

function pickRings (equips, check) {
  rings.forEach(ring => pickRings2(equips.concat(ring), check));
}

function pickRings2 (equips, check) {
  const lastEquip = equips.slice(-1)[0];
  rings
   .filter(ring => lastEquip.name != ring.name)
   .forEach(ring => check(equips.concat(ring)));
}

//let minSuccessCost = Number.POSITIVE_INFINITY;
let maxSuccessCost = Number.NEGATIVE_INFINITY;

function check(equips) {
  const playerStat = {
    hp: 100,
    cost: equips.reduce((acc, eqp) => acc + eqp.cost, 0),
    damage: equips.reduce((acc, eqp) => acc + eqp.damage, 0),
    armor: equips.reduce((acc, eqp) => acc + eqp.armor, 0)
  };

  //if (checkFight(playerStat) && (playerStat.cost < minSuccessCost)) {
  if (checkFight(playerStat) && (playerStat.cost > maxSuccessCost)) {
    console.log(playerStat, equips.map(e => e.name).join());
    //minSuccessCost = playerStat.cost;
    maxSuccessCost = playerStat.cost;
  }
}

function checkFight (playerStat) {
  const bossEffectAtk = Math.max(1, bossStat.damage - playerStat.armor);
  const playerEffectAtk = Math.max(1, playerStat.damage - bossStat.armor);

  const bossDiedAt = Math.ceil(bossStat.hp / playerEffectAtk);
  const playerDiedAt = Math.ceil(playerStat.hp / bossEffectAtk);

  //return bossDiedAt <= playerDiedAt;
  return bossDiedAt > playerDiedAt;
}

pickWeapon([], check);
//console.log(minSuccessCost);
console.log(maxSuccessCost);
