"use strict";

/*
const input = `10 ORE => 10 A
1 ORE => 1 B
7 A, 1 B => 1 C
7 A, 1 C => 1 D
7 A, 1 D => 1 E
7 A, 1 E => 1 FUEL`
*/

/*
const input = `157 ORE => 5 NZVS
165 ORE => 6 DCFZ
44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL
12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ
179 ORE => 7 PSHF
177 ORE => 5 HKGWZ
7 DCFZ, 7 PSHF => 2 XJWVT
165 ORE => 2 GPVTF
3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT`
*/

/*
const input = `2 VPVL, 7 FWMGM, 2 CXFTF, 11 MNCFX => 1 STKFG
17 NVRVD, 3 JNWZP => 8 VPVL
53 STKFG, 6 MNCFX, 46 VJHF, 81 HVMC, 68 CXFTF, 25 GNMV => 1 FUEL
22 VJHF, 37 MNCFX => 5 FWMGM
139 ORE => 4 NVRVD
144 ORE => 7 JNWZP
5 MNCFX, 7 RFSQX, 2 FWMGM, 2 VPVL, 19 CXFTF => 3 HVMC
5 VJHF, 7 MNCFX, 9 VPVL, 37 CXFTF => 6 GNMV
145 ORE => 6 MNCFX
1 NVRVD => 8 CXFTF
1 VJHF, 6 MNCFX => 4 RFSQX
176 ORE => 6 VJHF`;
*/

/*
const input = `171 ORE => 8 CNZTR
7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL
114 ORE => 4 BHXH
14 VRPVC => 6 BMBT
6 BHXH, 18 KTJDG, 12 WPTQ, 7 PLWSL, 31 FHTLT, 37 ZDVW => 1 FUEL
6 WPTQ, 2 BMBT, 8 ZLQW, 18 KTJDG, 1 XMNCP, 6 MZWV, 1 RJRHP => 6 FHTLT
15 XDBXC, 2 LTCX, 1 VRPVC => 6 ZLQW
13 WPTQ, 10 LTCX, 3 RJRHP, 14 XMNCP, 2 MZWV, 1 ZLQW => 1 ZDVW
5 BMBT => 4 WPTQ
189 ORE => 9 KTJDG
1 MZWV, 17 XDBXC, 3 XCVML => 2 XMNCP
12 VRPVC, 27 CNZTR => 2 XDBXC
15 KTJDG, 12 BHXH => 5 XCVML
3 BHXH, 2 VRPVC => 7 MZWV
121 ORE => 7 VRPVC
7 XCVML => 6 RJRHP
5 BHXH, 4 VRPVC => 5 LTCX`;
*/

const input = require("fs").readFileSync('./day_14.input', 'utf-8');


class BOM { // bill of material
    constructor(materialList = []) {
        this.map = new Map();
        for (const {factor, material} of materialList) {
            this.map.set(material, factor);
        }
    }

    get materialList () {
        return Array.from(this.map.entries(), ([material, factor]) => ({ factor, material }));
    }

    clone () {
        return new BOM(this.materialList);
    }

    add (other) {
        for (const [material, factor] of other.map) {
            const myFactor = this.map.get(material) || 0;
            this.map.set(material, factor + myFactor);
        }
    }

    multiplyNew (multiplier) {
        return new BOM(this.materialList.map(({ material, factor }) => ({
            material,
            factor: factor * multiplier,
        })));
    }

    remove (material) {
        this.map.delete(material);
    }

    [Symbol.iterator] (){
        return this.map.entries();
    }
}

class Formula {
    constructor(line) {
        const [ingredients, product] = line.split(' => ');
        this.product = this.parseFactorPair(product);
        this.ingredients = ingredients.split(', ').map(this.parseFactorPair);
        this.ingredientsBOM = new BOM(this.ingredients);
    }

    parseFactorPair (segment) {
        const [factorStr, material] = segment.split(' ');
        return {
            factor: parseInt(factorStr, 10),
            material,
        }
    }

    get productMaterial () {
        return this.product.material;
    }
    get productFactor () {
        return this.product.factor;
    }
}


const parseInput = (input) => {
    const lines = input.split('\n').filter(l => l.length > 0);

    const formulas = new Map();
    for (const l of lines) {
        const f = new Formula(l);
        formulas.set(f.productMaterial, f);
    }

    return formulas;
};

const formulas = parseInput(input);

const getBOMForFuel = (fuelFactor) => {
    const need = new BOM([{ material: 'FUEL', factor: fuelFactor}]);

    const getLeastNeededMaterial = (bom) => {
        let leastNeeded = '';
        let leastNeededFactor = Infinity;

        for (const [material, factor] of bom) {
            if (factor > 0 && factor < leastNeededFactor && material != 'ORE') {
                leastNeeded = material;
                leastNeededFactor = factor;
            }
        }
        return {
            factor: leastNeededFactor,
            material: leastNeeded,
        }
    };

    while (true) {
        const leastNeedPair = getLeastNeededMaterial(need);
        if (leastNeedPair.material == '') {
            break;
        }
        const generator = formulas.get(leastNeedPair.material);
        const multiplier = Math.ceil(leastNeedPair.factor / generator.productFactor)
        need.add(generator.ingredientsBOM.multiplyNew(multiplier));
        need.add(new BOM([generator.product]).multiplyNew(-1 * multiplier));
    }

    return need;
}


// part I
// const need = getBOMForFuel(1);
// console.log(need.map.get('ORE'));

// part II
let TARGET_ORE_COUNT = 10 ** 12;
let high = 10 ** 12;
let low = 1;
while (high > low) {
    let fuelFactor = low + Math.ceil((high - low) / 2);
    const need = getBOMForFuel(fuelFactor);
    console.log(`-----`);
    console.log(`high: ${high}, low: ${low}, mid : ${fuelFactor}`);
    console.log(`ore factor: ${need.map.get('ORE')}`);

    const oreFactor = need.map.get('ORE');
    if (oreFactor > TARGET_ORE_COUNT) {
        high = fuelFactor - 1;
    } else if (oreFactor <= TARGET_ORE_COUNT) {
        low = fuelFactor;
    }
}

console.log(`high: ${high}, low: ${low}`);
