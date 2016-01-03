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
  activeEffect: []
};

const spells = {
  missle: {
   name: 'Magic Missle',
   cost: 53,
   addEffect: '',
   cast: field => field.bossHP -= 4
  },
  drain: {
   name: 'Drain',
   cost: 73,
   addEffect: '',
   cast: field => {
     field.bossHP -= 2;
     field.playerHP += 2;
   }
  },
  shield: {
   name: 'Shield',
   cost: 113,
   addEffect: 'player',
   effect: field => field.playerArmor = 7,
   effectLast: 6
  },
  poison: {
   name: 'Poison',
   cost: 173,
   addEffect: 'boss',
   effect: field => field.bossHP -= 3,
   effectLast: 6
  },
  recharge: {
   name: 'Recharge',
   cost: 229,
   addEffect: 'player',
   effect: field => field.playerMana += 101,
   effectLast: 5
  }
};

const spellNames = Object.keys(spells);

console.log(spellNames);

function castSpell(field, spellName) {
  const spellDetail = spells[spellName];
  if (field.playerMana < spellDetail.cost) {
    return false;
  }
  if (spellDetail.addEffect == '') {
    spellDetail.cast(field);
    return true;
  }
  if (field.activeEffect.some(ef => ef.name == spellName)) {
    return false;
  }

  field.activeEffect.push({
    name: spellName,
    timer: spellDetail.effectLast,
    effect: spellDetail.effect
  });

  return true
}

function dupeField (field) {
  return {
    playerHP: field.playerHP,
    playerMana: field.playerMana,
    playerArmor: field.playerArmor,
    playerCostMana: field.playerCostMana,
    bossHP: field.bossHP,
    bossDamage: field.bossDamage,
    history: field.history.slice(),
    activeEffect: field.activeEffect.map(ef => ({
        name: ef.name,
        timer: ef.timer,
        effect: ef.effect
      })
    )
  }
}

let minManaCost = Number.POSITIVE_INFINITY;

function checkEndGame(field) {
  if (field.playerHP <= 0) {
    return true;
  }
  if (field.bossHP <= 0) {
    if (field.playerCostMana < minManaCost) {
      console.log('check: ', roundChecked);
      console.log(JSON.stringify(field, null, " "));
      minManaCost = field.playerCostMana;
    }
    return true;
  }
  return false;
}

let roundChecked = 0;

function oneRound(field, spellToCast) {
  roundChecked += 1;

  if (field.playerCostMana > minManaCost) {
    //console.log('ending this');
    return null;
  }

  function applyEffect(field) {
    let shieldOn = false;
    field.activeEffect
      .forEach(ef => {
        shieldOn = shieldOn || ef.name == 'shield';
        ef.timer -= 1;
        ef.effect(field)
      });
    field.activeEffect = field.activeEffect.filter(ef => ef.timer > 0);

    field.playerArmor = shieldOn ? 7 : 0;
  }
  
  // begin of player round
  field.playerHP -= 1;
  if (checkEndGame(field)) {
    return null;
  }

  applyEffect(field);
  if (checkEndGame(field)) {
    return null;
  }

  // player spell
  if (!castSpell(field, spellToCast)) {
    //console.log('can\'t cast this spell: ', spellToCast,
      //spells[spellToCast].cost, field.playerMana);
    return null;
  }

  const spellCost = spells[spellToCast].cost;
  field.history.push(spellToCast);
  field.playerMana -= spellCost;
  field.playerCostMana += spellCost;

  if (checkEndGame(field)) {
    return null;
  }

  // boss turn
  applyEffect(field);
  if (checkEndGame(field)) {
    return null;
  }

  field.playerHP -= Math.max(1, field.bossDamage - field.playerArmor);
  if (checkEndGame(field)) {
    return null;
  }

  return field;
}

let currentField = dupeField(theField);

function recurs(field) {
  spellNames.forEach(spellName => {
    const nextField = dupeField(field);
    if (oneRound(nextField, spellName) == null) {
      return;
    }
    recurs(nextField);
  });
}


recurs(theField);
console.log(minManaCost);

/*
let playing = theField;
const scheme = ['recharge', 'shield', 'drain', 'poison', 'missle'];

for (let i = 0; playing != null; ++i) {
  console.log('round', i, scheme[i], ':', JSON.stringify(playing));
  console.log('');
  playing = oneRound(dupeField(playing), scheme[i]);
}
*/
