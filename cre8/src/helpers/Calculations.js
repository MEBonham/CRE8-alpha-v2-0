import gc from './GameConstants';
import { kitDefault } from './Templates';

const determineLevel = (xp_total) => {
    let calcLevel = 0;
    let xpThreshold = 0;
    while (xp_total >= xpThreshold) {
        calcLevel += 1;
        let increment = gc.xp_increment_per_level * calcLevel;
        if (increment > gc.max_level_pre_epic * gc.xp_increment_per_level) {
            increment = gc.epic_level_xp_increment;
        }
        xpThreshold += increment;
    }
    return [calcLevel, xpThreshold];
}

export const ifPlus = (val) => {
    if (parseInt(val) >= 0) return "+";
    else return "";
}

const mineKits = (kitsObj, stack1stLevelKits) => {
    let total = 0;
    Object.keys(kitsObj).forEach((level) => {
        const kitsAtLevel = kitsObj[level];
        if (stack1stLevelKits) {
            Object.keys(kitsAtLevel).forEach((index) => {
                total += kitsAtLevel[index];
            });
        } else {
            let bestSoFar = 0;
            Object.keys(kitsAtLevel).forEach((index) => {
                if (kitsAtLevel[index] > bestSoFar) bestSoFar = kitsAtLevel[index];
            });
            total += bestSoFar;
        }
    });
    return total;
}

export const mineModifiers = (modsObj) => {
    let total = 0;
    const bonusTypes = Object.keys(modsObj);
    bonusTypes.forEach(type => {
        const sources = Object.keys(modsObj[type]);
        if (type === "circumstance" || type === "untyped") {
            sources.forEach(source => {
                total += parseInt(modsObj[type][source].num);
            });
        } else {
            let bestSoFar = 0;
            sources.forEach(source => {
                const mod = parseInt(modsObj[type][source].num);
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

export const numSort = (numArr) => {
    return numArr.sort((a, b) => { return a - b });
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
                num: gc.good_save_boost
            };
            delete refMod["Original Good Save"];
            delete willMod["Original Good Save"];
            break;
        case "reflex":
            delete fortMod["Original Good Save"];
            refMod["Original Good Save"] = {
                level: 1,
                num: gc.good_save_boost
            };
            delete willMod["Original Good Save"];
            break;
        case "willpower":
            delete fortMod["Original Good Save"];
            delete refMod["Original Good Save"];
            willMod["Original Good Save"] = {
                level: 1,
                num: gc.good_save_boost
            };
            break;
        default:
            return statsObj;
    }
    const fortitude_mods = {
        ...statsObj.fortitude_mods,
        base: {
            ...statsObj.fortitude_mods.base,
            fortMod
        }
    };
    const reflex_mods = {
        ...statsObj.reflex_mods,
        base: {
            ...statsObj.reflex_mods.base,
            refMod
        }
    };
    const willpower_mods = {
        ...statsObj.willpower_mods,
        base: {
            ...statsObj.willpower_mods.base,
            willMod
        }
    };
    const fortitude_base_total = heroic_bonus + mineModifiers({ base: fortMod });
    const reflex_base_total = heroic_bonus + mineModifiers({ base: refMod });
    const willpower_base_total = heroic_bonus + mineModifiers({ base: willMod });
    let result = {
        ...statsObj,
        fortitude_base_total,
        fortitude_mods,
        fortitude_total: heroic_bonus + mineModifiers(fortitude_mods),
        reflex_base_total,
        reflex_mods,
        reflex_total: heroic_bonus + mineModifiers(reflex_mods),
        willpower_base_total,
        willpower_mods,
        willpower_total: heroic_bonus + mineModifiers(willpower_mods),
    };
    if (fortitude_base_total !== origFortBase) {
        result = updateVpMax(result);
    }
    return result;
}

const updateHeroicBonus = (statsObj) => {
    const hb = statsObj.heroic_bonus;

    const defense_total = hb + mineModifiers(statsObj.defense_mods);
    const fortitude_base_total = hb + mineModifiers({ base: statsObj.fortitude_mods.base });
    const fortitude_total = hb + mineModifiers(statsObj.fortitude_mods);
    const reflex_base_total = hb + mineModifiers({ base: statsObj.reflex_mods.base });
    const reflex_total = hb + mineModifiers(statsObj.reflex_mods);
    const willpower_base_total = hb + mineModifiers({ base: statsObj.willpower_mods.base });
    const willpower_total = hb + mineModifiers(statsObj.willpower_mods);

    const fighting_level = hb + statsObj.fighting_level_kits_total;
    const caster_level = hb + statsObj.caster_level_kits_total;
    const coast_number = gc.base_coast_number + hb + statsObj.coast_number_kits_total;

    let result = {
        ...statsObj,
        defense_total,
        fortitude_base_total,
        fortitude_total,
        reflex_base_total,
        reflex_total,
        willpower_base_total,
        willpower_total,
        fighting_level,
        caster_level,
        coast_number
    };
    result = updateVpMax(result);
    result = updateMpMax(result);
    result = updateSpellcraft(result);
    return result;
}

export const updateKits = (statsObj) => {
    let result = {
        ...statsObj,
        traits_from_kits: [],
        passives: []
    };
    const kitsAlreadyChecked = [];
    Object.keys(statsObj.kits).forEach((level) => {
        const kitsAtLevel = statsObj.kits[level];
        Object.keys(kitsAtLevel).forEach((index) => {
            let kitObj = (kitsAtLevel[index].id) ? kitsAtLevel[index] : kitDefault;
            if (kitsAlreadyChecked.includes(kitsAtLevel[index].id) && !kitsAtLevel[index].can_repeat) kitObj = kitDefault;
            if (parseInt(level) >= statsObj.level) kitObj = kitDefault;

            result.traits_from_kits = result.traits_from_kits.concat(kitObj.benefit_traits).concat(kitObj.drawback_traits);
            result.passives = result.passives.concat(kitObj.passives);

            const talentsGranted = kitObj.bonus_talents.length;
            const talentsArr = result.talents[level] ? Object.keys(result.talents[level]).filter((index) => index.startsWith("kit")) : [];
            const talentsClaimed = talentsArr.length;
            if (talentsClaimed > talentsGranted) {
                for (let i = talentsGranted; i < talentsClaimed; i++) {
                    delete result.talents[level][`kit_${index}_${i}`];
                }
            }

            if (
                kitObj.fighting_level_boost ||
                (kitObj.fighting_OR_caster_boost && kitObj.selected_options.fighting_OR_caster_boost && kitObj.selectedOptions.fighting_OR_caster_boost === "fighting") ||
                (kitObj.fighting_OR_coast_boost && kitObj.selected_options.fighting_OR_coast_boost && kitObj.selectedOptions.fighting_OR_coast_boost === "fighting")
            ) {
                result.fighting_level_kits = {
                    ...result.fighting_level_kits,
                    [level]: {
                        ...result.fighting_level_kits[level],
                        [index]: 1
                    }
                };
            } else {
                result.fighting_level_kits = {
                    ...result.fighting_level_kits,
                    [level]: {
                        ...result.fighting_level_kits[level],
                        [index]: 0
                    }
                };
            }

            if (
                kitObj.caster_level_boost ||
                (kitObj.fighting_OR_caster_boost && kitObj.selected_options.fighting_OR_caster_boost && kitObj.selectedOptions.fighting_OR_caster_boost === "caster") ||
                (kitObj.caster_OR_coast_boost && kitObj.selected_options.caster_OR_coast_boost && kitObj.selectedOptions.caster_OR_coast_boost === "caster")
            ) {
                result.caster_level_kits = {
                    ...result.caster_level_kits,
                    [level]: {
                        ...result.caster_level_kits[level],
                        [index]: 1
                    }
                };
            } else {
                result.caster_level_kits = {
                    ...result.caster_level_kits,
                    [level]: {
                        ...result.caster_level_kits[level],
                        [index]: 0
                    }
                };
            }

            if (
                kitObj.coast_number_boost ||
                (kitObj.fighting_OR_coast_boost && kitObj.selected_options.fighting_OR_coast_boost && kitObj.selectedOptions.fighting_OR_coast_boost === "coast") ||
                (kitObj.caster_OR_coast_boost && kitObj.selected_options.caster_OR_coast_boost && kitObj.selectedOptions.caster_OR_coast_boost === "coast")
            ) {
                result.coast_number_kits = {
                    ...result.coast_number_kits,
                    [level]: {
                        ...result.coast_number_kits[level],
                        [index]: 1
                    }
                };
            } else {
                result.coast_number_kits = {
                    ...result.coast_number_kits,
                    [level]: {
                        ...result.coast_number_kits[level],
                        [index]: 0
                    }
                };
            }

            kitsAlreadyChecked.push(kitObj.id);
        });
    });
    result = updateTalents(result);

    const stack1stLevelKits = result.traits_from_kits.includes("Stack 1st-Level Kits");

    result.fighting_level_kits_total = mineKits(result.fighting_level_kits, stack1stLevelKits);
    result.fighting_level = result.heroic_bonus + result.fighting_level_kits_total;

    result.caster_level_kits_total = mineKits(result.caster_level_kits, stack1stLevelKits);
    result.caster_level = result.heroic_bonus + result.caster_level_kits_total;
    result = updateSpellcraft(result);
    result = updateMpMax(result);

    result.coast_number_kits_total = mineKits(result.coast_number_kits, stack1stLevelKits);
    result.coast_number = gc.base_coast_number + result.heroic_bonus + result.coast_number_kits_total;

    return result;
}

const updateLevel = (statsObj) => {
    const origHeroicBonus = statsObj.heroic_bonus;
    const heroic_bonus = Math.min(gc.max_level_pre_epic / 2, Math.floor(statsObj.level / 2));
    const level_max8 = Math.min(gc.max_level_pre_epic, statsObj.level);
    const awesome_check = gc.base_awesome_bonus + level_max8 + mineModifiers(statsObj.awesome_mods);
    let result = {
        ...statsObj,
        heroic_bonus,
        level_max8,
        awesome_check
    };
    result = updateKits(result);
    result = updateVpMax(result);
    if (heroic_bonus !== origHeroicBonus) {
        result = updateHeroicBonus(result);
    }
    return result;
}

const updateMpMax = (statsObj) => {
    const origMpMax = statsObj.mp_max;

    const mp_mods_total = mineModifiers(statsObj.mp_mods);
    const mp_max = statsObj.caster_level + mp_mods_total;
    const mp = Math.max(0, statsObj.mp + (mp_max - origMpMax));
    return {
        ...statsObj,
        mp_mods_total,
        mp_max,
        mp
    };
}

const updateSkillMods = (statsObj) => {
    const skill_mods_net = {};
    const initialVals = {};
    gc.skills_list.forEach(skill => {
        initialVals[skill] = {};
    });
    const skill_mods = {
        ...initialVals,
        ...statsObj.skill_mods
    };
    gc.skills_list.forEach(skill => {
        skill_mods_net[skill] = statsObj.skill_ranks[skill] + mineModifiers(skill_mods[skill]);
    });
    return {
        ...statsObj,
        skill_mods,
        skill_mods_net
    };
}

export const updateSkillRanks = (statsObj) => {
    const skill_ranks = {};
    gc.skills_list.forEach(skill => {
            skill_ranks[skill] = 0;
    });

    const trained_skills = [];
    for (let i = 0; i < statsObj.level_max8; i++) {
        if (statsObj.trained_skills_history[i]) {
            Object.keys(statsObj.trained_skills_history[i]).forEach(src => {
                const skill = statsObj.trained_skills_history[i][src];
                if (gc.skills_list.includes(skill) && !trained_skills.includes(skill)) {
                    trained_skills.push(skill);
                    skill_ranks[skill] += gc.trained_skill_extra_ranks;
                }
            })
        }
        if (statsObj.skill_ranks_history[i]) {
            for (let j = 0; j < gc.skill_ranks_per_level; j++) {
                if (statsObj.skill_ranks_history[i][j] && gc.skills_list.includes(statsObj.skill_ranks_history[i][j])) {
                    skill_ranks[statsObj.skill_ranks_history[i][j]] += 1;
                }
            }
        }
    }
    const maxUntrained = statsObj.level_max8;
    const maxTrained = maxUntrained + gc.trained_skill_extra_ranks;
    gc.skills_list.forEach(skill => {
        if (trained_skills.includes(skill)) {
            skill_ranks[skill] = Math.min(skill_ranks[skill], maxTrained);
        } else {
            skill_ranks[skill] = Math.min(skill_ranks[skill], maxUntrained);
        }
    });
    let result = {
        ...statsObj,
        trained_skills,
        skill_ranks
    };
    return updateSkillMods(result);
}

const updateSpellcraft = (statsObj) => {
    const spellcraft_mods_total = mineModifiers(statsObj.spellcraft_mods);
    const spellcraft_check = statsObj.caster_level + spellcraft_mods_total;
    return {
        ...statsObj,
        spellcraft_check,
        spellcraft_mods_total
    };
}

export const updateTalents = (statsObj) => {
    return statsObj;
}

const updateVpMax = (statsObj) => {
    const origVpMax = statsObj.vp_max;
    
    const vp_kits_total = mineKits(statsObj.vp_kits);
    const vp_max = gc.base_vitality_points + (2 * statsObj.level_max8) + vp_kits_total + statsObj.fortitude_base_total;
    const vp = Math.max(0, statsObj.vp + (vp_max - origVpMax));
    return {
        ...statsObj,
        vp_kits_total,
        vp_max,
        vp
    };
}

export const updateXp = (statsObj) => {
    const xpPerParcel = gc.xp_per_parcel;

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