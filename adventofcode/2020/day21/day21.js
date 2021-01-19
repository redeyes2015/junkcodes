const _input = require('fs').readFileSync('day21.input', 'utf-8');
const input = `mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)`;

function parse(input) {
    const lines = input.split('\n').filter(l => l.length > 0);
    return lines.map(line => {
    const [, ingredientsList, allergensList] = /^(.*) \(contains ([a-z, ]+)\)$/.exec(line);
        return {
            ingredients: ingredientsList.split(' '),
            allergens: allergensList.split(', '),
        }
    });
}

function isSameList (l1, l2) {
    return l1.length == l2.length && l1.every(v => l2.includes(v));
}

function isSameFood (f1, f2) {
    return isSameList(f1.ingredients, f2.ingredients) &&
        isSameList(f1.allergens, f2.allergens);
}

function round (foods, confirmedMap) {
    foods = foods.map(({ allergens, ingredients }) => {
        return {
            allergens: allergens.filter(a => !confirmedMap.has(a)),
            ingredients: ingredients.filter(i => !confirmedMap.has(i)),
        };
    }).filter(f => f.allergens.length > 0 && f.ingredients.length > 0);

    const nextFoods = [];
    for (const f1 of foods) {
        if (f1.allergens.length == 1 && f1.ingredients.length == 1) {
            nextFoods.push(f1);
            continue;
        }
        for (const f2 of foods) {
            if (isSameFood(f1, f2)) {
                continue;
            }
            const overlappedAllergen = f1.allergens.filter(a => f2.allergens.includes(a));
            if (overlappedAllergen.length == 0) {
                continue;
            }
            const overlappedIng = f1.ingredients.filter(i => f2.ingredients.includes(i));
            if (overlappedIng.length == 0) {
                throw new Error("wrong!");
            }
            const newF = {
                allergens: overlappedAllergen,
                ingredients: overlappedIng,
            };
            if (!isSameFood(newF, f1) && !isSameFood(newF, f2)) {
                nextFoods.push(newF);
            }
        }
    }
    console.log(nextFoods.length);
    for(const f of nextFoods.filter(f => f.allergens.length == 1 && f.ingredients.length == 1)) {
        confirmedMap.set(f.allergens[0], f.ingredients[0]);
        confirmedMap.set(f.ingredients[0], f.allergens[0]);
    }

    console.log(confirmedMap);
    return [...foods, ...nextFoods].map(({ allergens, ingredients }) => {
        return {
            allergens: allergens.filter(a => !confirmedMap.has(a)),
            ingredients: ingredients.filter(i => !confirmedMap.has(i)),
        };
    }).filter(f => f.allergens.length > 0 && f.ingredients.length > 0);
}

function solve(input) {
    const initFoods = parse(input);
    const confirmedMap = new Map();
    let foods = initFoods;
    for(let i = 0; i < 2; ++i) {
        const nextFoods = round(foods, confirmedMap);
        if (nextFoods.length == 0) {
            break;
        }
        foods = nextFoods;
    };
    console.log(confirmedMap);
}

//console.log(round(parse(input), new Map()));
solve(input);
