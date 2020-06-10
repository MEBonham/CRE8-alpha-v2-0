import { mineModifiers, numSort } from './Calculations';

const MersenneTwister = require('mersenne-twister');

let gen = new MersenneTwister();

const d20 = () => {
    return Math.floor(20 * gen.random() + 1)
}
const d6 = () => {
    return Math.floor(6 * gen.random() + 1)
}

export const roll = (dieMode, modBasic, modsMisc, coastVal) => {
    let multRoll;
    let natRoll;
    switch (dieMode) {
        case "normal":
            multRoll = [d20(), d20(), d20()];
            natRoll = numSort(multRoll.slice())[1];
            break;
        case "boost":
            multRoll = [d20(), d20()];
            natRoll = numSort(multRoll.slice())[1];
            break;
        case "drag":
            multRoll = [d20(), d20()];
            natRoll = numSort(multRoll.slice())[0];
            break;
        default:
            multRoll = [d20()];
            natRoll = multRoll[0];
    }
    const netMod = parseInt(modBasic) + mineModifiers(modsMisc);
    return {
        multRoll,
        natRoll,
        netMod,
        result: Math.max(natRoll, coastVal) + netMod,
        coastNote: coastVal > natRoll ? true : false
    };
}

export const wealthRoll = (prevWealth, vector, merchant, haggle) => {
    const d6history = [];
    let finalDifference;
    let finalWealth;
    const subtotal = Math.max(0, prevWealth + vector);
    const diceNumber = (merchant || vector < 0) ? prevWealth : subtotal;
    for (let i = 0; i < diceNumber; i++) {
        d6history.push(d6());
    }
    let successes = d6history.filter((result) => (result > 4)).length;
    if (vector < 0) {
        if (haggle && successes < d6history.length) {
            successes += 1;
        } 
        finalWealth = Math.min(prevWealth, subtotal + successes);
    } else {
        if (haggle && successes > 0) {
            successes -= 1;
        }
        finalWealth = Math.max(prevWealth, subtotal - successes);
    }
    finalDifference = finalWealth - prevWealth;
    return {
        d6history,
        finalDifference,
        finalWealth,
        haggle
    };
}