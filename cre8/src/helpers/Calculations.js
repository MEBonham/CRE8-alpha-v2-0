const determineLevel = (xp_total) => {
    let calcLevel = 0;
    let xpThreshold = 0;
    while (xp_total >= xpThreshold) {
        calcLevel += 1;
        let increment = 100 * calcLevel;
        if (increment > 800) {
            increment = 500;
        }
        xpThreshold += increment;
    }
    return [calcLevel, xpThreshold];
}

const mineKits = (kitsObj) => {
    // TODO
    return 0;
}

const mineModifiers = (modsObj) => {
    let total = 0;
    const bonusTypes = Object.keys(modsObj);
    bonusTypes.forEach(type => {
        const sources = Object.keys(modsObj[type]);
        if (type === "circumstance") {
            sources.forEach(source => {
                total += modsObj[type][source].num;
            });
        } else {
            let bestSoFar = 0;
            sources.forEach(source => {
                const mod = modsObj[type][source].num;
                if (mod < 0) {
                    total += mod;
                } else if (mod > bestSoFar) {
                    bestSoFar = mod;
                }
            });
            total += bestSoFar;
        }
    });
    return total;
}

const mineParcels = (parcelsObj) => {
    // TODO
    return 0;
}

export const updateBaseXp = (statsObj) => {
    return updateXP(statsObj);
}

export const updateGoodSave = (statsObj) => {
    const origFortBase = statsObj.fortitude_base_total;
    const { heroic_bonus } = statsObj;

    let fortMod = statsObj.fortitude_mods.base;
    let refMod = statsObj.reflex_mods.base;
    let willMod = statsObj.willpower_mods.base;
    switch (statsObj.good_save) {
        case "fortitude":
            fortMod["Original Good Save"] = {
                level: 1,
                num: 2
            };
            delete refMod["Original Good Save"];
            delete willMod["Original Good Save"];
            break;
        case "reflex":
            delete fortMod["Original Good Save"];
            refMod["Original Good Save"] = {
                level: 1,
                num: 2
            };
            delete willMod["Original Good Save"];
            break;
        case "willpower":
            delete fortMod["Original Good Save"];
            delete refMod["Original Good Save"];
            willMod["Original Good Save"] = {
                level: 1,
                num: 2
            };
            break;
        default:
            return statsObj;
    }
    const fortitude_mods = {
        ...statsObj.fortitude_mods,
        base: fortMod
    };
    const reflex_mods = {
        ...statsObj.reflex_mods,
        base: refMod
    };
    const willpower_mods = {
        ...statsObj.willpower_mods,
        base: willMod
    };
    const fortitude_base_total = heroic_bonus + mineModifiers({ base: fortMod });
    const reflex_base_total = heroic_bonus + mineModifiers({ base: refMod });
    const willpower_base_total = heroic_bonus + mineModifiers({ base: willMod });
    let result = {
        ...statsObj,
        fortitude_base_total,
        fortitude_mods,
        fortitude_mods_total: heroic_bonus + mineModifiers(fortitude_mods),
        reflex_base_total,
        reflex_mods,
        reflex_mods_total: heroic_bonus + mineModifiers(reflex_mods),
        willpower_base_total,
        willpower_mods,
        willpower_mods_total: heroic_bonus + mineModifiers(willpower_mods),
    };
    if (fortitude_base_total !== origFortBase) {
        result = updateVpMax(result);
    }
    return result;
}

const updateLevel = (statsObj) => {
    // const origHeroicBonus = statsObj.heroic_bonus;
    const heroic_bonus = Math.min(4, Math.floor(statsObj.level / 2));
    const level_max8 = Math.min(8, statsObj.level);
    let result = {
        ...statsObj,
        heroic_bonus,
        level_max8
    };
    result = updateVpMax(result);
    // if (heroic_bonus !== origHeroicBonus) {
    //     result = updateHeroicBonus(result);
    // }
    return result;
}

const updateVpMax = (statsObj) => {
    const origVpMax = statsObj.vp_max;
    
    const vp_kits_total = mineKits(statsObj.vp_kits);
    const vp_max = 5 + (2 * statsObj.level_max8) + vp_kits_total + statsObj.fortitude_base_total;
    const vp = Math.max(0, statsObj.vp + (vp_max - origVpMax));
    return {
        ...statsObj,
        vp_kits_total,
        vp_max,
        vp
    };
}

const updateXP = (statsObj) => {
    const xpPerParcel = 30;

    const origLevel = statsObj.level;
    
    const xp_parcels_total = mineParcels(statsObj.xp_parcels);
    const xp = statsObj.xp_base + (xpPerParcel * xp_parcels_total);
    const [level, next_level_at] = determineLevel(xp);
    let result = {
        ...statsObj,
        xp_parcels_total,
        xp,
        level,
        next_level_at
    };
    if (level !== origLevel) {
        result = updateLevel(result);
    }
    return result;
}