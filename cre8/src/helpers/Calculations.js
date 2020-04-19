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
    return 0;
}

const mineParcels = (parcelsObj) => {
    return 0;
}

export const updateBaseXp = (statsObj) => {
    return updateXP(statsObj);
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