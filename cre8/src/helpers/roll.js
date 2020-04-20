import { mineModifiers, numSort } from './Calculations';

const MersenneTwister = require('mersenne-twister');
var gen = new MersenneTwister();

export const d20 = () => {
    return Math.floor(20 * gen.random() + 1)
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
        result: Math.max(natRoll, coastVal) + netMod
    };
}