import { mineModifiers, numSort } from './Calculations';

const MersenneTwister = require('mersenne-twister');
var gen = new MersenneTwister();

export const d20 = () => {
    return Math.floor(20 * gen.random() + 1)
}

export const roll = (dieMode, modBasic, modsMisc, coastVal) => {
    let natRoll;
    switch (dieMode) {
        case "normal":
            natRoll = numSort([d20(), d20(), d20()])[1];
            break;
        case "boost":
            natRoll = numSort([d20(), d20()])[1];
            break;
        case "drag":
            natRoll = numSort([d20(), d20()])[0];
            break;
        default:
            natRoll = d20();
    }
    return {
        natRoll,
        result: Math.max(natRoll, coastVal) + parseInt(modBasic) + mineModifiers(modsMisc)
    };
}