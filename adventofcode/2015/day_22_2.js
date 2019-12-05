'use strict';

const bossDamage = 10;
const bossInitHP = 71;
const playerInitHP = 50;
const playerInitMana = 500;

const theField = {
  playerHP: playerInitHP,
  playerMana: playerInitMana,
  playerArmor: 0,
  playerCostMana: 0,
  bossHP: bossInitHP,
  bossDamage: bossDamage,
  history: [],
  timers: {
    shield: 0,
    poison: 0,
    recharge: 0
  }
};

const spells = {
  missle: {
   cost: 53,
  },
  drain: {
   cost: 73,
  },
  shield: {
   cost: 113,
   effectLast: 6,
  },
  poison: {
   cost: 173,
   effectLast: 6,
  },
  recharge: {
   cost: 229,
   effectLast: 5,
  }
};

const spellNames = Object.keys(spells);

console.log(spellNames);

function dupeField (field) {
  return {
    playerHP: field.playerHP,
    playerMana: field.playerMana,
    playerArmor: field.playerArmor,
    playerCostMana: field.playerCostMana,
    bossHP: field.bossHP,
    bossDamage: field.bossDamage,
    history: field.history.slice(),
    timers: {
      shield: field.timers.shield,
      poison: field.timers.poison,
      recharge: field.timers.recharge
    }
  }
}

function statusEffect (field) {
  const timers = field.timers;
  if (timers.shield > 0) {
    field.playerArmor = 7;
    timers.shield -= 1;
  }
  else {
    field.playerArmor = 0;
  }
  if (timers.poison > 0) {
    field.bossHP -= 3;
    timers.poison -= 1;
  }
  if (timers.recharge > 0) {
    field.playerMana += 101;
    timers.recharge -= 1;
  }
}


function enemyTurn (field) {
  statusEffect(field);
  if (field.bossHP <= 0) {
    return;
  }
  field.playerHP -= Math.max(field.bossDamage - field.playerArmor, 1);
}

function playerTurn (field) {
  // part II
  field.playerHP -= 1;
  if (field.playerHP <= 0) {
    return [];
  }

  statusEffect(field);

  if (field.bossHP <= 0) {
    return [field];
  }

  return spellNames.map(spell => {
    const spellDetail = spells[spell];
    const spellCost = spellDetail.cost;

    if (field.playerMana < spellCost) {
      return null;
    }
    if (spellDetail.hasOwnProperty('effectLast')
        && field.timers[spell] > 0) {
      return null;
    }

    const nextField = dupeField(field);
    nextField.history.push(spell);
    nextField.playerCostMana += spellCost;
    nextField.playerMana -= spellCost;

    if (spellDetail.hasOwnProperty('effectLast')) {
      nextField.timers[spell] = spellDetail.effectLast;
      return nextField;
    }
    if (spell == 'missle') {
      nextField.bossHP -= 4;
    }
    //else if (spell == 'drain') {
    else {
      nextField.bossHP -= 2;
      nextField.playerHP += 2;
    }
    return nextField;
  })
  .filter(field => field != null);
}

function runRandom () {
  let minManaCost = Number.POSITIVE_INFINITY;

  function iterate (field) {
    while (true) {
      const nextFields = playerTurn(field);
      const possibility = nextFields.length;

      if (possibility == 0) {
        return null;
      }

      field = nextFields[Math.floor(possibility * Math.random())];

      if (field.playerCostMana >= minManaCost) {
        return null;
      }
      if (field.bossHP <= 0) {
        return field
      }

      enemyTurn(field);
      if (field.playerHP <= 0) {
        return null;
      }
    }
  }

  for (let i = 0; i < 1000000; ++i) {
    const result = iterate(dupeField(theField));
    if (result == null) {
      continue;
    }
    if (result.playerCostMana < minManaCost) {
      console.log('check:', i);
      console.log(JSON.stringify(result, null, " "));
      minManaCost = result.playerCostMana;
    }
  }
  console.log('minManaCost', minManaCost);
}

function runBFS () {
  let minManaCost = Number.POSITIVE_INFINITY;
  let uncheckedFields = playerTurn(dupeField(theField));
  let checkCount = 0;

  function checkEndGame (field) {
    if (field.playerHP <= 0) {
      return true;
    }
    if (field.bossHP <= 0) {
      console.log(checkCount, uncheckedFields.length);

      if (field.playerCostMana < minManaCost) {
        console.log(JSON.stringify(field, null, " "));
        minManaCost = field.playerCostMana;
      }
      return true;
    }
    return false;
  }

  while (uncheckedFields.length > 0) {
    checkCount += 1;
    const currentField = uncheckedFields.pop();
    
    if (currentField.playerCostMana >= minManaCost) {
      continue;
    }
    if (checkEndGame(currentField)) {
      continue;
    }

    enemyTurn(currentField);
    if (checkEndGame(currentField)) {
      continue;
    }

    const nextFields = playerTurn(currentField);
    if (nextFields.length < 1) {
      continue;
    }

    uncheckedFields = uncheckedFields.concat(nextFields).sort((f1, f2) => {
      if (f1.bossHP != f2.bossHP) {
        return f2.bossHP - f1.bossHP;
      }
      return f2.playerCostMana - f2.playerCostMana;
    });
  }
  console.log('checkCount', checkCount, 'minManaCost', minManaCost);
}

runBFS();
