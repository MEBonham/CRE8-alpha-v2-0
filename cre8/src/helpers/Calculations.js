import gc from './GameConstants';
import { charDefault, attackDefault, kitDefault, featDefault, talentDefault } from './Templates';

const clearAttacks = (statsObj, srcTypeArr) => {
    return {
        ...statsObj,
        attacks: statsObj.attacks.filter((item) => !srcTypeArr.includes(item.srcType))
    };
}

const clearBonuses = (statsObj, srcTypeArr) => {
    const result = { ...statsObj };
    const todoList = Object.keys(charDefault.stats).filter((property) => property.endsWith("_mods"));
    todoList.forEach((property) => {
        const modsObj = result[property];
        if (property === "skill_mods") {
            Object.keys(modsObj).forEach((skill) => {
                Object.keys(modsObj[skill]).forEach((bonusType) => {
                    Object.keys(modsObj[skill][bonusType]).forEach((source) => {
                        const prevSrcType = result[property][skill][bonusType][source].srcType;
                        if (!prevSrcType || srcTypeArr.includes(prevSrcType)) {
                            delete result[property][skill][bonusType][source]
                        }
                    });
                });
            });
        } else {
            Object.keys(modsObj).forEach((bonusType) => {
                Object.keys(modsObj[bonusType]).forEach((source) => {
                    const prevSrcType = result[property][bonusType][source].srcType;
                    if (!prevSrcType || srcTypeArr.includes(prevSrcType)) {
                        delete result[property][bonusType][source]
                    }
                });
            });
        }
    });
    return result;
}

const clearFreeActions = (statsObj, srcTypeArr) => {
    return {
        ...statsObj,
        free_actions: statsObj.free_actions.filter((item) => !srcTypeArr.includes(item.srcType))
    };
}

const clearMoveActions = (statsObj, srcTypeArr) => {
    return {
        ...statsObj,
        move_actions: statsObj.move_actions.filter((item) => !srcTypeArr.includes(item.srcType))
    };
}

const clearOpportunityActions = (statsObj, srcTypeArr) => {
    return {
        ...statsObj,
        opportunity_actions: statsObj.opportunity_actions.filter((item) => !srcTypeArr.includes(item.srcType))
    };
}

const clearPassives = (statsObj, srcTypeArr) => {
    return {
        ...statsObj,
        passives: statsObj.passives.filter((item) => !srcTypeArr.includes(item.srcType)),
    };
}

const clearRestFeatures = (statsObj, srcTypeArr) => {
    return {
        ...statsObj,
        extended_rest_actions: statsObj.extended_rest_actions.filter((item) => !srcTypeArr.includes(item.srcType)),
        short_rest_actions: statsObj.short_rest_actions.filter((item) => !srcTypeArr.includes(item.srcType))
    };
}

const clearStandardActions = (statsObj, srcTypeArr) => {
    return {
        ...statsObj,
        standard_actions: statsObj.standard_actions.filter((item) => !srcTypeArr.includes(item.srcType))
    };
}

const clearSwiftActions = (statsObj, srcTypeArr) => {
    return {
        ...statsObj,
        swift_actions: statsObj.swift_actions.filter((item) => !srcTypeArr.includes(item.srcType))
    };
}

const clearSynergies = (statsObj, srcTypeArr) => {
    const result = { ...statsObj };
    const objCopy = {};
    Object.keys(result.synergy_bonuses).forEach((skill) => {
        const arrCopy = [];
        result.synergy_bonuses[skill].forEach((bonus) => {
            if (bonus.srcType && !srcTypeArr.includes(bonus.srcType)) {
                arrCopy.push(bonus);
            }
        });
        objCopy[skill] = arrCopy;
    })
    return {
        ...result,
        synergy_bonuses: objCopy
    };
}

const clearTrainings = (statsObj, srcTypeArr) => {
    const result = { ...statsObj };
    Object.keys(result.trained_skills_history).forEach((level) => {
        Object.keys(result.trained_skills_history[level]).forEach((source) => {
            const prevSrcType = result.trained_skills_history[level][source].srcType;
            if (!prevSrcType || srcTypeArr.includes(prevSrcType)) {
                delete result.trained_skills_history[level][source];
            }
        });
    });
    result.trained_skills_history["0"] = {
        ...charDefault.stats.trained_skills_history["0"],
        ...result.trained_skills_history["0"]
    };
    return result;
}

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

export const getDisplayName = (codeProperty) => {
    switch (codeProperty) {
        case "Athletics":
        case "Brawn":
        case "Charisma":
        case "Dexterity":
        case "Gadgetry":
        case "Glibness":
        case "Knowledge":
        case "Nature":
        case "Perception":
        case "Stealth":
            return codeProperty;
        case "av_mods":
            return "Armor Value";
        case "fortitude_mods":
            return "Fortitude save";
        case "mp_mods":
            return "MP Pool";
        case "rp_mods":
            return "RP Pool";
        default:
            let result = codeProperty.split("_").slice(0, -1);
            result = result.map((word) => {
                const firstLetter = word[0].toUpperCase();
                return `${firstLetter}${word.slice(1)}`;
            });
            return result.join(" ");

    }
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

export const mineModifiers = (modsObj, qualifiers) => {
    let total = 0;
    const bonusTypes = Object.keys(modsObj);
    bonusTypes.forEach(type => {
        const sources = Object.keys(modsObj[type]);
        if (type === "Circumstance" || type === "Untyped" || type === "buy_history") {
            sources.forEach(source => {
                const obj = modsObj[type][source];
                if ((!obj.conditional) || qualifiers[obj.condition.split("=")[0]] === obj.condition.split("=")[1] ||
                        (obj.condition.split(">=")[0] === "level" && qualifiers.level >= obj.condition.split(">=")[1])) {
                    total += parseInt(obj.num);
                }
            });
        } else {
            let bestSoFar = 0;
            sources.forEach(source => {
                const obj = modsObj[type][source];
                if ((!obj.conditional) || qualifiers[obj.condition.split("=")[0]] === obj.condition.split("=")[1] ||
                        (obj.condition.split(">=")[0] === "level" && qualifiers.level >= obj.condition.split(">=")[1])) {
                    const mod = parseInt(obj.num);
                    if (mod < 0) {
                        total += mod;
                    } else if (mod > bestSoFar) {
                        bestSoFar = mod;
                    }
                }
            });
            total += bestSoFar;
        }
    });
    return total;
}

const mineParcels = (kitsObj) => {
    let total = 0;
    Object.keys(kitsObj).forEach((level) => {
        Object.keys(kitsObj[level]).forEach((index) => {
            const parcelsAcquired = kitsObj[level][index].xp_parcels_acquired || [];
            parcelsAcquired.forEach((bool) => {
                if (bool) {
                    total += 1;
                }
            });
        });
    });
    return total;
}

export const numSort = (numArr) => {
    return numArr.sort((a, b) => { return a - b });
}

export const unflattenInventory = (flattened) => {
    const unFlat = [];
    flattened.forEach((itemObj) => {
        if (itemObj.contained) {
            let lastIndex = unFlat.length - 1;
            unFlat[lastIndex] = {
                ...unFlat[lastIndex],
                held_items: [
                    ...unFlat[lastIndex].held_items,
                    itemObj
                ]
            };
        } else {
            unFlat.push(itemObj);
        }
    });
    return unFlat;
}

const updateAttacks = (statsObj) => {
    const attacks = statsObj.attacks.map((attackObj) => {
        let accuracy;
        let peril_rating;
        let impact_total_mod = 0;
        if (attackObj.type === "vim") {
            accuracy = 10 + statsObj.fortitude_total;
            peril_rating = statsObj.fortitude_total + attackObj.peril_mod;
        } else if (attackObj.type === "spell") {
            accuracy = 10 + statsObj.caster_level + mineModifiers(statsObj.spell_accuracy_mods, {
                ...attackObj,
                level: statsObj.level
            });
            peril_rating = statsObj.caster_level + attackObj.peril_mod;
            impact_total_mod = mineModifiers(statsObj.spell_impact_mods, {
                ...attackObj,
                level: statsObj.level
            });
        } else {
            accuracy = 10 + statsObj.fighting_level + mineModifiers(statsObj.weapon_accuracy_mods, {
                ...attackObj,
                level: statsObj.level,
                range: attackObj.range.startsWith("Melee") ? "melee" : "ranged"
            });
            if (attackObj.name === "Unarmed Strike" && !statsObj.traits_from_talents.includes("Unarmed Focus")) {
                accuracy -= 5;
            }
            peril_rating = statsObj.fighting_level + attackObj.peril_mod;
            impact_total_mod = mineModifiers(statsObj.weapon_impact_mods, {
                ...attackObj,
                level: statsObj.level,
                range: attackObj.range.startsWith("Melee") ? "melee" : "ranged"
            });
        }
        return {
            ...attackObj,
            accuracy,
            peril_rating,
            impact_total_mod
        };
    })
    return {
        ...statsObj,
        attacks
    };
}

const updateAv = (statsObj) => {
    const armor_value = Math.max(0, (gc.base_armor_value + mineModifiers(statsObj.av_mods, { level: statsObj.level })));
    const resistance_value = gc.resistance_boost + Math.max(armor_value, statsObj.level_max8) + mineModifiers(statsObj.resistance_mods, { level: statsObj.level });
    return {
        ...statsObj,
        armor_value,
        resistance_value
    };
}

const updateAwesome = (statsObj) => {
    const awesome_mods_total = mineModifiers(statsObj.awesome_mods, { level: statsObj.level });
    const awesome_check = gc.base_awesome_bonus + statsObj.level_max8 + awesome_mods_total;
    return {
        ...statsObj,
        awesome_mods_total,
        awesome_check
    };
}

const updateDefense = (statsObj) => {
    const defense_total = statsObj.heroic_bonus + mineModifiers(statsObj.defense_mods, { level: statsObj.level });
    return {
        ...statsObj,
        defense_total
    };
}

const updateEncumbrance = (statsObj) => {
    let result = { ...statsObj };
    result = clearBonuses(result, ["encumbrance"]);

    let totalBulk = Math.floor(result.wealth / 10);
    result.inventory.forEach((itemObj) => {
        if (itemObj.location !== "Not Carried" && 
                (itemObj.location !== "Worn/Wielded" || !itemObj.tags.includes("Armor") || !parseInt(itemObj.hands_occupied) === 0)) {
            totalBulk += itemObj.quantity * parseInt(itemObj.bulk);
            let subtotal = 0;
            itemObj.held_items.forEach((heldObj) => {
                subtotal += heldObj.quantity * parseInt(heldObj.bulk);
            });
            if (itemObj.halve_bulk_capacity) {
                const bulkToHalve = Math.min(subtotal, itemObj.halve_bulk_capacity);
                totalBulk += (subtotal - Math.ceil(bulkToHalve / 2));
            } else {
                totalBulk += subtotal;
            }
        }
    });
    result.bulk_carried = totalBulk;

    let capacity = Math.max(0, 50 + 10 * result.skill_mods_net.Brawn);
    if (result.size_final > -4) {
        capacity = Math.max(capacity, 1);
    }
    if (result.size_final > -3) {
        capacity = Math.max(capacity, 5);
    }
    const encumbrance = Math.min(0, Math.floor((capacity - totalBulk) / 10));
    // console.log(encumbrance);
    result = {
        ...result,
        skill_mods: {
            ...result.skill_mods,
            Athletics: {
                ...result.skill_mods.Athletics,
                Encumbrance: {
                    ...result.skill_mods.Athletics.Encumbrance,
                    bulk_carried: {
                        num: encumbrance,
                        srcType: "encumbrance"
                    }
                }
            },
            Dexterity: {
                ...result.skill_mods.Dexterity,
                Encumbrance: {
                    ...result.skill_mods.Dexterity.Encumbrance,
                    bulk_carried: {
                        num: encumbrance,
                        srcType: "encumbrance"
                    }
                }
            },
            Stealth: {
                ...result.skill_mods.Stealth,
                Encumbrance: {
                    ...result.skill_mods.Stealth.Encumbrance,
                    bulk_carried: {
                        num: encumbrance,
                        srcType: "encumbrance"
                    }
                }
            }
        },
        speed_mods: {
            ...result.speed_mods,
            Encumbrance: {
                ...result.speed_mods.Encumbrance,
                bulk_carried: {
                    num: 5 * encumbrance,
                    srcType: "encumbrance"
                }
            }
        }
    };

    result = updateVariousMods(result);
    return result;
}

export const updateFeats = (statsObj) => {
    let result = {
        ...statsObj,
        traits_from_feats: []
    };
    result = clearAttacks(result, ["feat"]);
    result = clearBonuses(result, ["feat"]);
    result = clearPassives(result, ["feat"]);
    result = clearRestFeatures(result, ["feat"]);
    result = clearStandardActions(result, ["feat"]);
    result = clearMoveActions(result, ["feat"]);
    result = clearSwiftActions(result, ["feat"]);
    result = clearOpportunityActions(result, ["feat"]);
    result = clearFreeActions(result, ["feat"]);
    result = clearSynergies(result, ["feat"]);
    result = clearTrainings(result, ["feat"]);
    const featsAlreadyChecked = [];
    Object.keys(statsObj.feats).forEach((level) => {
        const featsAtLevel = statsObj.feats[level];
        Object.keys(featsAtLevel).forEach((index) => {
            let featObj = (featsAtLevel[index].id) ? featsAtLevel[index] : featDefault;
            if (featsAlreadyChecked.includes(featsAtLevel[index].id) && !featsAtLevel[index].can_repeat) featObj = featDefault;
            if (parseInt(level) >= statsObj.level) featObj = featDefault;

            result.traits_from_feats = result.traits_from_feats.concat(featObj.benefit_traits).concat(featObj.drawback_traits);
            featObj.passives.forEach((passiveFeature) => {
                result.passives.push({
                    ...passiveFeature,
                    displaySource: featObj.name,
                    src: featObj.id,
                    srcType: "feat"
                });
            });
            featObj.standard_actions.forEach((action) => {
                result.standard_actions.push({
                    displaySource: featObj.name,
                    text: action,
                    src: featObj.id,
                    srcType: "feat"
                });
            });
            featObj.move_actions.forEach((action) => {
                result.move_actions.push({
                    displaySource: featObj.name,
                    text: action,
                    src: featObj.id,
                    srcType: "feat"
                });
            });
            featObj.swift_actions.forEach((action) => {
                result.swift_actions.push({
                    displaySource: featObj.name,
                    text: action,
                    src: featObj.id,
                    srcType: "feat"
                });
            });
            featObj.opportunity_actions.forEach((action) => {
                result.opportunity_actions.push({
                    displaySource: featObj.name,
                    text: action,
                    src: featObj.id,
                    srcType: "feat"
                });
            });
            featObj.free_actions.forEach((action) => {
                result.free_actions.push({
                    displaySource: featObj.name,
                    text: action,
                    src: featObj.id,
                    srcType: "feat"
                });
            });
            featObj.short_rest_actions.forEach((action) => {
                result.short_rest_actions.push({
                    displaySource: featObj.name,
                    text: action,
                    src: featObj.id,
                    srcType: "feat"
                });
            });
            featObj.extended_rest_actions.forEach((action) => {
                result.extended_rest_actions.push({
                    displaySource: featObj.name,
                    text: action,
                    src: featObj.id,
                    srcType: "feat"
                });
            });

            featObj.various_bonuses.forEach((bonusObj) => {
                if (bonusObj.type === "Synergy") {
                    if (!result.synergy_bonuses[bonusObj.skill]) result.synergy_bonuses[bonusObj.skill] = [];
                    result.synergy_bonuses = {
                        ...result.synergy_bonuses,
                        [bonusObj.skill]: [
                            ...result.synergy_bonuses[bonusObj.skill],
                            {
                                to: bonusObj.to,
                                display: getDisplayName(bonusObj.to),
                                primary: false,
                                source: featObj.id,
                                srcType: "feat"
                            }
                        ]
                    }
                } else {
                    result[bonusObj.to] = {
                        ...result[bonusObj.to],
                        [bonusObj.type]: {
                            ...result[bonusObj.to][bonusObj.type],
                            [featObj.id]: {
                                level: level,
                                num: bonusObj.num,
                                srcType: "feat"
                            }
                        }
                    }
                }
            });

            result.attacks = [
                ...result.attacks,
                ...featObj.attacks.map((attackObj) => ({
                    ...attackDefault,
                    ...attackObj,
                    damage_type: {
                        ...attackDefault.damage_type,
                        ...attackObj.damage_type
                    },
                    src: featObj.id,
                    srcType: "feat"
                }))
            ];

            result = {
                ...result,
                passives: [
                    ...result.passives,
                    ...Object.keys(featObj.selected_options).flatMap((optionType) => {
                        if (optionType === "selectivePassives") {
                            const selectedOption = featObj.selected_options[optionType];
                            return {
                                text: featObj.selective_passives[selectedOption],
                                src: featObj.id,
                                srcType: "feat"
                            };
                        } else return [];
                    })
                ]
            };

            featsAlreadyChecked.push(featObj.id);
        });
    });
    result = updateTalents(result);

    result = updateSynergies(result);               // Includes updateVariousMods()
    if (featsAlreadyChecked.includes("mageflight")) {
        result = updateMageFlight(result);
        result = updateMpMax(result);
    }
    return result;
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
                num: gc.good_save_boost,
                srcType: "automatic"
            };
            delete refMod["Original Good Save"];
            delete willMod["Original Good Save"];
            break;
        case "reflex":
            delete fortMod["Original Good Save"];
            refMod["Original Good Save"] = {
                level: 1,
                num: gc.good_save_boost,
                srcType: "automatic"
            };
            delete willMod["Original Good Save"];
            break;
        case "willpower":
            delete fortMod["Original Good Save"];
            delete refMod["Original Good Save"];
            willMod["Original Good Save"] = {
                level: 1,
                num: gc.good_save_boost,
                srcType: "automatic"
            };
            break;
        default:
            return statsObj;
    }
    const fortitude_mods = {
        ...statsObj.fortitude_mods,
        base: {
            ...statsObj.fortitude_mods.base,
            ...fortMod
        }
    };
    const reflex_mods = {
        ...statsObj.reflex_mods,
        base: {
            ...statsObj.reflex_mods.base,
            ...refMod
        }
    };
    const willpower_mods = {
        ...statsObj.willpower_mods,
        base: {
            ...statsObj.willpower_mods.base,
            ...willMod
        }
    };
    const fortitude_base_total = heroic_bonus + mineModifiers({ base: fortMod }, { level: statsObj.level });
    const reflex_base_total = heroic_bonus + mineModifiers({ base: refMod }, { level: statsObj.level });
    const willpower_base_total = heroic_bonus + mineModifiers({ base: willMod }, { level: statsObj.level });
    let result = {
        ...statsObj,
        fortitude_base_total,
        fortitude_mods,
        fortitude_total: heroic_bonus + mineModifiers(fortitude_mods, { level: statsObj.level }),
        reflex_base_total,
        reflex_mods,
        reflex_total: heroic_bonus + mineModifiers(reflex_mods, { level: statsObj.level }),
        willpower_base_total,
        willpower_mods,
        willpower_total: heroic_bonus + mineModifiers(willpower_mods, { level: statsObj.level }),
    };
    if (fortitude_base_total !== origFortBase) {
        result = updateVpMax(result);
    }
    return result;
}

const updateHeroicBonus = (statsObj) => {
    const hb = statsObj.heroic_bonus;

    const defense_total = hb + mineModifiers(statsObj.defense_mods, { level: statsObj.level });
    const fortitude_base_total = hb + mineModifiers({ base: statsObj.fortitude_mods.base }, { level: statsObj.level });
    const fortitude_total = hb + mineModifiers(statsObj.fortitude_mods, { level: statsObj.level });
    const reflex_base_total = hb + mineModifiers({ base: statsObj.reflex_mods.base }, { level: statsObj.level });
    const reflex_total = hb + mineModifiers(statsObj.reflex_mods, { level: statsObj.level });
    const willpower_base_total = hb + mineModifiers({ base: statsObj.willpower_mods.base }, { level: statsObj.level });
    const willpower_total = hb + mineModifiers(statsObj.willpower_mods, { level: statsObj.level });

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

export const updateItems = (statsObj) => {
    let result = { ...statsObj };
    result = clearAttacks(result, ["item"]);
    result = clearBonuses(result, ["item"]);

    const processItem = (itemObj) => {
        let attacksArr = [];
        if (itemObj.location === "Worn/Wielded" || !itemObj.worn_or_wielded) {
            attacksArr = itemObj.attacks.map((attackObj) => {
                let type;
                let improvised = "false";
                let shieldbash = "false";
                if (attackObj.categories.includes("Spell")) {
                    type = "spell_attack";
                } else if (attackObj.categories.includes("Vim")) {
                    type = "vim_attack";
                } else if (attackObj.categories.includes("Natural Weapon")) {
                    type = "natural_weapon";
                } else {
                    type = "weapon";
                }
                if (itemObj.tags.includes("Armor") && parseInt(itemObj.hands_occupied) === 1) {
                    improvised = "true";
                    shieldbash = "true";
                }
                return {
                    ...attackDefault,
                    type,
                    ...attackObj,
                    damage_type: {
                        ...attackDefault.damage_type,
                        ...attackObj.damage_type
                    },
                    improvised,
                    shieldbash,
                    src: itemObj.id,
                    srcType: "item"
                }
            });
            result.attacks = [ ...result.attacks, ...attacksArr ];

            let fullShieldFlag = false;
            itemObj.various_bonuses.forEach((bonusObj) => {
                if (bonusObj.type === "Synergy") {
                    if (!result.synergy_bonuses[bonusObj.skill]) result.synergy_bonuses[bonusObj.skill] = [];
                    result.synergy_bonuses = {
                        ...result.synergy_bonuses,
                        [bonusObj.skill]: [
                            ...result.synergy_bonuses[bonusObj.skill],
                            {
                                to: bonusObj.to,
                                display: getDisplayName(bonusObj.to),
                                primary: false,
                                source: itemObj.id,
                                srcType: "item"
                            }
                        ]
                    }
                } else if (gc.skills_list.includes(bonusObj.to)) {
                    result.skill_mods[bonusObj.to] = {
                        ...result.skill_mods[bonusObj.to],
                        [bonusObj.type]: {
                            ...result.skill_mods[bonusObj.to][bonusObj.type],
                            [itemObj.id]: {
                                num: bonusObj.num,
                                srcType: "item"
                            }
                        }
                    }
                } else {
                    result[bonusObj.to] = {
                        ...result[bonusObj.to],
                        [bonusObj.type]: {
                            ...result[bonusObj.to][bonusObj.type],
                            [itemObj.id]: {
                                num: bonusObj.num,
                                srcType: "item"
                            }
                        }
                    }
                    if (itemObj.tags.includes("Armor") && parseInt(itemObj.hands_occupied) === 1 &&
                            bonusObj.type === "Untyped" && bonusObj.to === "weapon_accuracy_mods") {
                        result.weapon_accuracy_mods.Untyped[itemObj.id] = {
                            ...result.weapon_accuracy_mods.Untyped[itemObj.id],
                            conditional: true,
                            condition: "range=melee"
                        };
                        fullShieldFlag = true;
                    }
                }
            });

            itemObj.various_penalties.forEach((penaltyObj) => {
                if (gc.skills_list.includes(penaltyObj.to)) {
                    if (!result.skill_mods[penaltyObj.to][penaltyObj.type]) {
                        result.skill_mods[penaltyObj.to][penaltyObj.type] = {};
                    }
                    result.skill_mods[penaltyObj.to] = {
                        ...result.skill_mods[penaltyObj.to],
                        [penaltyObj.type]: {
                            ...result.skill_mods[penaltyObj.to][penaltyObj.type],
                            [itemObj.id]: {
                                num: penaltyObj.num,
                                srcType: "item"
                            }
                        }
                    };
                } else {
                    result[penaltyObj.to] = {
                        ...result[penaltyObj.to],
                        [penaltyObj.type]: {
                            ...result[penaltyObj.to][penaltyObj.type],
                            [itemObj.id]: {
                                num: penaltyObj.num,
                                srcType: "item"
                            }
                        }
                    }
                }
            });
            if (fullShieldFlag) {
                result.weapon_accuracy_mods.Untyped[`${itemObj.id}-2`] = {
                    num: -1,
                    srcType: "item",
                    conditional: true,
                    condition: "shieldbash=true"
                };
            }
        }
    }

    statsObj.inventory.forEach((itemObj) => {
        processItem(itemObj);
        itemObj.held_items.forEach((heldItemObj) => {
            processItem(heldItemObj);
        });
    });
    result = updateEncumbrance(result);
    result = updateAttacks(result);

    return result;
}

export const updateKits = (statsObj) => {
    let result = {
        ...statsObj,
        synergy_bonuses: charDefault.stats.synergy_bonuses,
        traits_from_kits: []
    };
    result = clearAttacks(result, ["kit"]);
    result = clearBonuses(result, ["kit"]);
    result = clearPassives(result, ["kit"]);
    result = clearRestFeatures(result, ["kit"]);
    result = clearFreeActions(result, ["kit"]);
    result = clearTrainings(result, ["kit"]);
    const kitsAlreadyChecked = [];
    Object.keys(statsObj.kits).forEach((level) => {
        const kitsAtLevel = statsObj.kits[level];
        Object.keys(kitsAtLevel).forEach((index) => {
            let kitObj = (kitsAtLevel[index].id) ? kitsAtLevel[index] : kitDefault;
            if (kitsAlreadyChecked.includes(kitsAtLevel[index].id) && !kitsAtLevel[index].can_repeat) kitObj = kitDefault;
            if (parseInt(level) >= statsObj.level) kitObj = kitDefault;
            // console.log(kitObj);

            result.traits_from_kits = result.traits_from_kits.concat(kitObj.benefit_traits).concat(kitObj.drawback_traits);
            kitObj.passives.forEach((passiveFeature) => {
                result.passives.push({
                    ...passiveFeature,
                    displaySource: kitObj.name,
                    src: kitObj.id,
                    srcType: "kit"
                });
            });
            kitObj.short_rest_actions.forEach((restAction) => {
                result.short_rest_actions.push({
                    text: restAction,
                    src: kitObj.id,
                    srcType: "kit"
                });
            });
            kitObj.extended_rest_actions.forEach((restAction) => {
                result.extended_rest_actions.push({
                    text: restAction,
                    src: kitObj.id,
                    srcType: "kit"
                });
            });
            kitObj.free_actions.forEach((freeAction) => {
                result.free_actions.push({
                    displaySource: kitObj.name,
                    text: freeAction,
                    src: kitObj.id,
                    srcType: "kit"
                });
            });

            if (kitObj.select_one_from_attacks) {
                kitObj.attacks = kitObj.attacks.map((attackObj) => ({
                    ...attackObj,
                    skip: true
                }));
            }
            if (
                kitObj.select_one_from_attacks &&
                kitObj.selected_options.select_one_from_attacks
            ) {
                kitObj.attacks = kitObj.attacks.map((attackObj) => {
                    if (attackObj.name === kitObj.selected_options.select_one_from_attacks) {
                        return {
                            ...attackObj,
                            skip: false
                        };
                    } else {
                        return { ...attackObj };
                    }
                });
            }
            result.attacks = [
                ...result.attacks,
                ...kitObj.attacks.filter((attackObj) => !attackObj.skip).map((attackObj) => ({
                    ...attackDefault,
                    ...attackObj,
                    damage_type: {
                        ...attackDefault.damage_type,
                        ...attackObj.damage_type
                    },
                    src: kitObj.id,
                    srcType: "kit"
                }))
            ];

            const talentsGranted = kitObj.bonus_talents.length;
            const talentsArr = result.talents[level] ? Object.keys(result.talents[level]).filter((i) => i.startsWith(`kit${index}`)) : [];
            const talentsClaimed = talentsArr.length;
            if (talentsClaimed > talentsGranted) {
                for (let i = talentsGranted; i < talentsClaimed; i++) {
                    delete result.talents[level][`kit${index}_${i}`];
                }
            }

            if (result.feats[level] && !kitObj.bonus_feat) {
                delete result.feats[level][`kit${index}`];
            }
            
            if (
                kitObj.fighting_level_boost ||
                (kitObj.fighting_OR_caster_boost && kitObj.selected_options.fighting_OR_caster_boost && kitObj.selected_options.fighting_OR_caster_boost === "fighting") ||
                (kitObj.fighting_OR_coast_boost && kitObj.selected_options.fighting_OR_coast_boost && kitObj.selected_options.fighting_OR_coast_boost === "fighting") ||
                (kitObj.fightingRpBoost_OR_rpPlus2 && kitObj.selected_options.fightingRpBoost_OR_rpPlus2 && kitObj.selected_options.fightingRpBoost_OR_rpPlus2 === "fightingRpBoosts")
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
                (kitObj.fighting_OR_caster_boost && kitObj.selected_options.fighting_OR_caster_boost && kitObj.selected_options.fighting_OR_caster_boost === "caster") ||
                (kitObj.caster_OR_coast_boost && kitObj.selected_options.caster_OR_coast_boost && kitObj.selected_options.caster_OR_coast_boost === "caster")
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
                (kitObj.fighting_OR_coast_boost && kitObj.selected_options.fighting_OR_coast_boost && kitObj.selected_options.fighting_OR_coast_boost === "coast") ||
                (kitObj.caster_OR_coast_boost && kitObj.selected_options.caster_OR_coast_boost && kitObj.selected_options.caster_OR_coast_boost === "coast")
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

            if (
                kitObj.vpPlus2_OR_mpPlus2 &&
                kitObj.selected_options.vpPlus2_OR_mpPlus2 &&
                kitObj.selected_options.vpPlus2_OR_mpPlus2 === "mpPlus2"
            ) {
                result = {
                    ...result,
                    mp_mods: {
                        ...result.mp_mods,
                        Untyped: {
                            ...result.mp_mods.Untyped,
                            [kitObj.id]: {
                                num: 2,
                                level,
                                srcType: "kit"
                            }
                        }
                    }
                };
            }

            let vp_boost = parseInt(kitObj.vp_boost);
            if (
                kitObj.vpPlus2_OR_mpPlus2 &&
                kitObj.selected_options.vpPlus2_OR_mpPlus2 &&
                kitObj.selected_options.vpPlus2_OR_mpPlus2 === "vpPlus2"
            ) {
                vp_boost += 2;
            }
            if (
                kitObj.vpPlus2_OR_buffTalent &&
                kitObj.selected_options.vpPlus2_OR_buffTalent &&
                kitObj.selected_options.vpPlus2_OR_buffTalent === "vpPlus2"
            ) {
                vp_boost += 2;
            }
            result.vp_kits = {
                ...result.vp_kits,
                [level]: {
                    ...result.vp_kits[level],
                    [index]: vp_boost
                }
            };

            if (kitObj.selected_options.fightingRpBoost_OR_rpPlus2 && kitObj.selected_options.fightingRpBoost_OR_rpPlus2 === "rpPlus2") {
                if (!result.rp_mods.Untyped) {
                    result.rp_mods.Untyped = {};
                }
                result.rp_mods = {
                    ...result.rp_mods,
                    Untyped: {
                        ...result.rp_mods.Untyped,
                        [kitObj.id]: {
                            num: 2,
                            level: [level],
                            srcType: "kit"
                        }
                    }
                };
            } else if (
                (kitObj.selected_options.fightingRpBoost_OR_rpPlus2 && kitObj.selected_options.fightingRpBoost_OR_rpPlus2 === "fightingRpBoosts")
            ) {
                if (!result.rp_mods.Untyped) {
                    result.rp_mods.Untyped = {};
                }
                result.rp_mods = {
                    ...result.rp_mods,
                    Untyped: {
                        ...result.rp_mods.Untyped,
                        [kitObj.id]: {
                            num: 1,
                            level: [level],
                            srcType: "kit"
                        }
                    }
                };
            }

            if (kitObj.bonus_trained_skills.length) {
                kitObj.bonus_trained_skills.forEach((bonusSkillTrained, i) => {
                    if (bonusSkillTrained.type === "specific") {
                        result.trained_skills_history[level] = result.trained_skills_history[level] ?
                            {
                                ...result.trained_skills_history[level],
                                [`${kitObj.id}_specific_${i}`]: {
                                    skill: bonusSkillTrained.options[0],
                                    srcType: "kit"
                                }
                            } : {
                                ...result.trained_skills_history[level],
                                [`${kitObj.id}_specific_${i}`]: {
                                    skill: bonusSkillTrained.options[0],
                                    srcType: "kit"
                                }
                            };
                    }
                })
            }
            if (kitObj.selected_options.trainedSkill && kitObj.selected_options.trainedSkill.length) {
                kitObj.selected_options.trainedSkill.forEach((skill, i) => {
                    if (skill) {
                        const source = kitObj.selected_options.trainedSkill.length > 1 ?
                            `${kitObj.id}_${i}` : kitObj.id;
                        result.trained_skills_history[level] = result.trained_skills_history[level] ?
                            {
                                ...result.trained_skills_history[level],
                                [source]: {
                                    skill,
                                    srcType: "kit"
                                }
                            } : {
                                [source]: {
                                    skill,
                                    srcType: "kit"
                                }
                            };
                    }
                })
            }

            kitObj.various_bonuses.forEach((bonusObj) => {
                if (bonusObj.type === "Synergy") {
                    if (!result.synergy_bonuses[bonusObj.skill]) result.synergy_bonuses[bonusObj.skill] = [];
                    result.synergy_bonuses = {
                        ...result.synergy_bonuses,
                        [bonusObj.skill]: [
                            ...result.synergy_bonuses[bonusObj.skill],
                            {
                                to: bonusObj.to,
                                display: getDisplayName(bonusObj.to),
                                primary: false,
                                source: kitObj.id,
                                srcType: "kit"
                            }
                        ]
                    }
                } else if (gc.skills_list.includes(bonusObj.to)) {
                    result.skill_mods[bonusObj.to] = {
                        ...result.skill_mods[bonusObj.to],
                        [bonusObj.type]: {
                            ...result.skill_mods[bonusObj.to][bonusObj.type],
                            [kitObj.id]: {
                                level,
                                num: bonusObj.num,
                                srcType: "kit"
                            }
                        }
                    }
                } else {
                    result[bonusObj.to] = {
                        ...result[bonusObj.to],
                        [bonusObj.type]: {
                            ...result[bonusObj.to][bonusObj.type],
                            [kitObj.id]: {
                                level,
                                num: bonusObj.num,
                                srcType: "kit"
                            }
                        }
                    }
                }
            });

            kitObj.various_penalties.forEach((penaltyObj) => {
                if (gc.skills_list.includes(penaltyObj.to)) {
                    if (!result.skill_mods[penaltyObj.to][penaltyObj.type]) {
                        result.skill_mods[penaltyObj.to][penaltyObj.type] = {};
                    }
                    result.skill_mods[penaltyObj.to] = {
                        ...result.skill_mods[penaltyObj.to],
                        [penaltyObj.type]: {
                            ...result.skill_mods[penaltyObj.to][penaltyObj.type],
                            [kitObj.id]: {
                                level,
                                num: penaltyObj.num,
                                srcType: "kit"
                            }
                        }
                    };
                } else {
                    result[penaltyObj.to] = {
                        ...result[penaltyObj.to],
                        [penaltyObj.type]: {
                            ...result[penaltyObj.to][penaltyObj.type],
                            [kitObj.id]: {
                                level,
                                num: penaltyObj.num,
                                srcType: "kit"
                            }
                        }
                    }
                }
            });

            if (parseInt(kitObj.grow_bigger_level)) {
                result.size_mods = {
                    ...result.size_mods,
                    Base: {
                        ...result.size_mods.Base,
                        [kitObj.id]: {
                            level: parseInt(kitObj.grow_bigger_level),
                            num: 1,
                            srcType: "kit",
                            conditional: true,
                            condition: `level>=${parseInt(kitObj.grow_bigger_level)}`
                        }
                    }
                };
            }
            if (kitObj.melee_weapon_impact_plus1) {
                result.weapon_impact_mods = {
                    ...result.weapon_impact_mods,
                    Feat: {
                        ...result.weapon_impact_mods.Feat,
                        [kitObj.id]: {
                            level,
                            num: 1,
                            srcType: "kit",
                            conditional: true,
                            condition: "range=melee"
                        }
                    }
                }
            }

            kitsAlreadyChecked.push(kitObj.id);
        });
    });
    result = updateFeats(result);
    result = updateTalents(result);

    result = updateSynergies(result);               // Includes updateVariousMods() which includes updateSize() and updateAttacks()

    result = updateSkillRanks(result);

    result = updateWealth(result);

    const stack1stLevelKits = result.traits_from_kits.includes("Stack 1st-Level Kits");

    result.fighting_level_kits_total = mineKits(result.fighting_level_kits, stack1stLevelKits);
    result.fighting_level = result.heroic_bonus + result.fighting_level_kits_total;
    result = updateAttacks(result);

    result.caster_level_kits_total = mineKits(result.caster_level_kits, stack1stLevelKits);
    result.caster_level = result.heroic_bonus + result.caster_level_kits_total;
    result = updateSpellcraft(result);
    result = updateMageArmor(result);
    result = updateMageFlight(result);
    result = updateMpMax(result);

    result.coast_number_kits_total = mineKits(result.coast_number_kits, stack1stLevelKits);
    result.coast_number = gc.base_coast_number + result.heroic_bonus + result.coast_number_kits_total;

    result = updateVpMax(result);

    return result;
}

const updateLevel = (statsObj) => {
    const origHeroicBonus = statsObj.heroic_bonus;
    const heroic_bonus = Math.min(gc.max_level_pre_epic / 2, Math.floor(statsObj.level / 2));
    const level_max8 = Math.min(gc.max_level_pre_epic, statsObj.level);
    const awesome_check = gc.base_awesome_bonus + level_max8 + mineModifiers(statsObj.awesome_mods, { level: statsObj.level });
    const xp_award = gc.xp_award_per_level_of_monster * statsObj.level;
    const xp_buffer = gc.xp_buffer_by_level[level_max8]; 
    let result = {
        ...statsObj,
        heroic_bonus,
        level_max8,
        awesome_check,
        xp_award,
        xp_buffer
    };
    result = updateKits(result);
    result = updateVpMax(result);
    if (heroic_bonus !== origHeroicBonus) {
        result = updateHeroicBonus(result);
    }
    return result;
}

const updateMageArmor = (statsObj) => {
    const slug = "magearmor";
    let result = { ...statsObj };
    let foundTalentObj;
    let foundLevel;
    Object.keys(statsObj.talents).forEach((level) => {
        Object.keys(statsObj.talents[level]).forEach((index) => {
            if (!foundTalentObj && statsObj.talents[level][index].id === slug) {
                foundTalentObj = statsObj.talents[level][index];
                foundLevel = level;
            }
        });
    });
    if (foundTalentObj) {
        let avNum = 2;
        if (statsObj.caster_level >= 2 && foundTalentObj.selected_options.consuming_mage_armor &&
            foundTalentObj.selected_options.consuming_mage_armor === "on") {
            result.mp_mods = {
                ...result.mp_mods,
                Untyped: {
                    ...result.mp_mods.Untyped,
                    [slug]: {
                        level: foundLevel,
                        num: -1,
                        srcType: "talent"
                    }
                }
            }
            avNum += 1;

            if (statsObj.caster_level >= 5) {
                avNum += 1;
            }
            if (statsObj.caster_level >= 9) {
                avNum += 1;
            }
        }
        result.av_mods = {
            ...result.av_mods,
            Item: {
                ...result.av_mods.Item,
                [slug]: {
                    level: foundLevel,
                    num: avNum,
                    srcType: "talent"
                }
            }
        };
    }
    return result;
}

const updateMageFlight = (statsObj) => {
    const slug = "mageflight";
    let result = { ...statsObj };
    let foundFeatObj;
    let foundLevel;
    Object.keys(statsObj.feats).forEach((level) => {
        Object.keys(statsObj.feats[level]).forEach((index) => {
            if (!foundFeatObj && statsObj.feats[level][index].id === slug) {
                foundFeatObj = statsObj.feats[level][index];
                foundLevel = level;
            }
        });
    });
    if (foundFeatObj) {
        if (foundFeatObj.selected_options.consuming_mage_flight &&
            foundFeatObj.selected_options.consuming_mage_flight === "on") {
            result.mp_mods = {
                ...result.mp_mods,
                Untyped: {
                    ...result.mp_mods.Untyped,
                    [slug]: {
                        level: foundLevel,
                        num: -2,
                        srcType: "feat"
                    }
                }
            }
        }
        result.passives = [
            ...result.passives,
            {
                displaySource: "Mage Flight",
                drawback: false,
                src: slug,
                srcType: "feat",
                text: "You can remain flying in between actions and turns."
            }
        ];
    }
    return result;
}

const updateMpMax = (statsObj) => {
    const origMpMax = statsObj.mp_max;

    const mp_mods_total = mineModifiers(statsObj.mp_mods, { level: statsObj.level });
    const mp_max = statsObj.caster_level + mp_mods_total;
    const mp = Math.max(0, statsObj.mp + (mp_max - origMpMax));
    return {
        ...statsObj,
        mp_mods_total,
        mp_max,
        mp
    };
}

const updateRpMax = (statsObj) => {
    const origRpMax = statsObj.rp_max;

    const rp_mods_total = mineModifiers(statsObj.rp_mods, { level: statsObj.level });
    const rp_max = gc.base_reserve_points + rp_mods_total;
    const rp = Math.max(0, statsObj.rp + (rp_max - origRpMax));
    return {
        ...statsObj,
        rp_mods_total,
        rp_max,
        rp
    };
}

const updateSize = (statsObj) => {
    const size_final = mineModifiers(statsObj.size_mods, { level: statsObj.level });
    let result = {
        ...statsObj,
        size_final
    };
    result = clearBonuses(result, ["size"]);
    result.traits_from_kits = result.traits_from_kits.filter((trait) => !trait.endsWith(" Size"));
    result.traits_from_kits.push(gc.size_categories[size_final]);
    result = updateDefense({
        ...result,
        defense_mods: {
            ...result.defense_mods,
            Size: {
                ...result.defense_mods.Size,
                "Final Size": {
                    srcType: "size",
                    num: (-1 * size_final),
                    level: 0
                }
            }
        }
    });
    result = updateSkillMods({
        ...result,
        skill_mods: {
            ...result.skill_mods,
            Brawn: {
                ...result.skill_mods.Brawn,
                Size: {
                    ...result.weapon_accuracy_mods.Size,
                    "Final Size": {
                        srcType: "size",
                        num: (2 * size_final),
                        level: 0
                    }
                }
            }
        }
    });
    result = updateAv({
        ...result,
        av_mods: {
            ...result.av_mods,
            Size: {
                ...result.av_mods.Size,
                "Final Size": {
                    srcType: "size",
                    num: (size_final),
                    level: 0
                }
            }
        }
    });
    result = updateAttacks({
        ...result,
        weapon_accuracy_mods: {
            ...result.weapon_accuracy_mods,
            Size: {
                ...result.weapon_accuracy_mods.Size,
                "Final Size": {
                    srcType: "size",
                    num: (-1 * size_final),
                    level: 0
                }
            }
        },
        weapon_impact_mods: {
            ...result.weapon_impact_mods,
            Size: {
                ...result.weapon_impact_mods.Size,
                "Final Size": {
                    srcType: "size",
                    num: (size_final),
                    level: 0
                }
            }
        }
    });
    result = updateSpeed({
        ...result,
        speed_mods: {
            ...result.speed_mods,
            Size: {
                ...result.speed_mods.Size,
                "Final Size": {
                    srcType: "size",
                    num: (5 * size_final),
                    level: 0
                }
            }
        }
    });
    return result;
}

const updateSkillMods = (statsObj) => {
    const prevBrawn = statsObj.skill_mods_net.Brawn;
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
        skill_mods_net[skill] = statsObj.skill_ranks[skill] + mineModifiers(skill_mods[skill], { level: statsObj.level });
    });
    let result = {
        ...statsObj,
        skill_mods,
        skill_mods_net
    };
    if (skill_mods_net.Brawn !== prevBrawn) {
        result = updateEncumbrance(result);
    }
    return result;
}

export const updateSkillRanks = (statsObj) => {
    // console.log(statsObj.trained_skills_history);
    const skill_ranks = {};
    gc.skills_list.forEach(skill => {
        skill_ranks[skill] = 0;
    });

    const trained_skills = [];
    for (let i = 0; i < statsObj.level; i++) {
        if (statsObj.trained_skills_history[i]) {
            Object.keys(statsObj.trained_skills_history[i]).forEach(src => {
                const skill = statsObj.trained_skills_history[i][src].skill;
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
    if (statsObj.skill_ranks_history.bonus) {
        Object.keys(statsObj.skill_ranks_history.bonus).forEach((idx) => {
            if (parseInt(idx) < statsObj.xp_parcels_total && gc.skills_list.includes(statsObj.skill_ranks_history.bonus[idx])) {
                skill_ranks[statsObj.skill_ranks_history.bonus[idx]] += 1;
            }
        });
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
    result = updateSynergies(result);
    return updateSkillMods(result);
}

const updateSpeed = (statsObj) => {
    const speed_mods_total = mineModifiers(statsObj.speed_mods, { level: statsObj.level });
    const speed = gc.base_speed + speed_mods_total;
    return {
        ...statsObj,
        speed,
        speed_mods_total
    };
}

const updateSpellcraft = (statsObj) => {
    const spellcraft_mods_total = mineModifiers(statsObj.spellcraft_mods, { level: statsObj.level });
    const spellcraft_check = statsObj.caster_level + spellcraft_mods_total;
    return {
        ...statsObj,
        spellcraft_check,
        spellcraft_mods_total
    };
}

export const updateSynergies = (statsObj) => {
    // Assumes previous use of relevant clearBonuses() function where applicable
    let result = { ...statsObj };
    
    const calcPrimary = (ranks) => {
        if (ranks >= 7) return 2;
        if (ranks >= 3) return 1;
        return 0;
    }
    const calcSecondary = (ranks) => {
        if (ranks >= 9) return 2;
        if (ranks >= 5) return 1;
        return 0;
    }

    Object.keys(result.synergy_bonuses).forEach((skill) => {
        const ranks = result.skill_ranks[skill];
        const bonusesArr = result.synergy_bonuses[skill];
        bonusesArr.forEach((synergy) => {
            const num = (synergy.primary) ? calcPrimary(ranks) : calcSecondary(ranks);
            if (gc.skills_list.includes(synergy.to)) {
                result.skill_mods[skill] = {
                    ...result.skill_mods[skill],
                    [synergy.source]: {
                        num,
                        srcType: [synergy.srcType]
                    }
                };
            } else {
                result[synergy.to] = {
                    ...result[synergy.to],
                    Synergy: {
                        ...result[synergy.to].Synergy,
                        [synergy.source]: {
                            num,
                            srcType: synergy.srcType
                        }
                    }
                }
            }
        });
    });
    result = updateVariousMods(result);
    return result;
}

export const updateTalents = (statsObj) => {
    let result = {
        ...statsObj,
        traits_from_talents: []
    };
    result = clearAttacks(result, ["talent"]);
    result = clearBonuses(result, ["talent"]);
    result = clearPassives(result, ["talent"]);
    result = clearRestFeatures(result, ["talent"]);
    result = clearStandardActions(result, ["talent"]);
    result = clearSwiftActions(result, ["talent"]);
    result = clearOpportunityActions(result, ["talent"]);
    result = clearFreeActions(result, ["talent"]);
    result = clearSynergies(result, ["talent"]);
    result = clearTrainings(result, ["talent"]);
    const talentsAlreadyChecked = [];
    Object.keys(statsObj.talents).forEach((level) => {
        const talentsAtLevel = statsObj.talents[level];
        Object.keys(talentsAtLevel).forEach((index) => {
            let talentObj = (talentsAtLevel[index].id) ? talentsAtLevel[index] : talentDefault;
            if (talentsAlreadyChecked.includes(talentsAtLevel[index].id) && !talentsAtLevel[index].can_repeat) talentObj = talentDefault;
            if (parseInt(level) >= statsObj.level) talentObj = talentDefault;

            result.traits_from_talents = result.traits_from_talents.concat(talentObj.benefit_traits).concat(talentObj.drawback_traits);
            if (!talentObj.mighty_constitution && !talentObj.lightning_agility && !talentObj.steely_focus) {
                talentObj.passives.forEach((passiveFeature) => {
                    result.passives.push({
                        ...passiveFeature,
                        displaySource: talentObj.name,
                        src: talentObj.id,
                        srcType: "talent"
                    });
                });
            }
            talentObj.standard_actions.forEach((action) => {
                result.standard_actions.push({
                    displaySource: talentObj.name,
                    text: action,
                    src: talentObj.id,
                    srcType: "talent"
                });
            });
            talentObj.swift_actions.forEach((action) => {
                result.swift_actions.push({
                    displaySource: talentObj.name,
                    text: action,
                    src: talentObj.id,
                    srcType: "talent"
                });
            });
            talentObj.opportunity_actions.forEach((action) => {
                result.opportunity_actions.push({
                    displaySource: talentObj.name,
                    text: action,
                    src: talentObj.id,
                    srcType: "talent"
                });
            });
            talentObj.free_actions.forEach((action) => {
                result.free_actions.push({
                    displaySource: talentObj.name,
                    text: action,
                    src: talentObj.id,
                    srcType: "talent"
                });
            });
            talentObj.short_rest_actions.forEach((action) => {
                result.short_rest_actions.push({
                    displaySource: talentObj.name,
                    text: action,
                    src: talentObj.id,
                    srcType: "talent"
                });
            });
            talentObj.extended_rest_actions.forEach((action) => {
                result.extended_rest_actions.push({
                    displaySource: talentObj.name,
                    text: action,
                    src: talentObj.id,
                    srcType: "talent"
                });
            });
            result.attacks = [
                ...result.attacks,
                ...talentObj.attacks.map((attackObj) => ({
                    ...attackDefault,
                    ...attackObj,
                    damage_type: {
                        ...attackDefault.damage_type,
                        ...attackObj.damage_type
                    },
                    src: talentObj.id,
                    srcType: "talent"
                }))
            ];

            if (talentObj.mighty_constitution) {
                if (result.good_save === "fortitude") {
                    result.passives.push({
                        ...talentObj.passives[0],
                        displaySource: talentObj.name,
                        src: talentObj.id,
                        srcType: "talent"
                    });
                } else if (result.level > 4) {
                    result.fortitude_mods = {
                        ...result.fortitude_mods,
                        base: {
                            ...result.fortitude_mods.base,
                            [talentObj.id]: {
                                level: level,
                                num: 2,
                                srcType: "talent"
                            }
                        }
                    };
                } else {
                    result.fortitude_mods = {
                        ...result.fortitude_mods,
                        base: {
                            ...result.fortitude_mods.base,
                            [talentObj.id]: {
                                level: level,
                                num: 1,
                                srcType: "talent"
                            }
                        }
                    };
                }
            } else if (talentObj.lightning_agility) {
                if (result.good_save === "reflex") {
                    result.passives.push({
                        ...talentObj.passives[0],
                        displaySource: talentObj.name,
                        src: talentObj.id,
                        srcType: "talent"
                    });
                } else if (result.level > 4) {
                    result.reflex_mods = {
                        ...result.reflex_mods,
                        base: {
                            ...result.reflex_mods.base,
                            [talentObj.id]: {
                                level: level,
                                num: 2,
                                srcType: "talent"
                            }
                        }
                    };
                } else {
                    result.reflex_mods = {
                        ...result.reflex_mods,
                        base: {
                            ...result.reflex_mods.base,
                            [talentObj.id]: {
                                level: level,
                                num: 1,
                                srcType: "talent"
                            }
                        }
                    };
                }
            } else if (talentObj.steely_focus) {
                if (result.good_save === "willpower") {
                    result.passives.push({
                        ...talentObj.passives[0],
                        displaySource: talentObj.name,
                        src: talentObj.id,
                        srcType: "talent"
                    });
                } else if (result.level > 4) {
                    result.willpower_mods = {
                        ...result.willpower_mods,
                        base: {
                            ...result.willpower_mods.base,
                            [talentObj.id]: {
                                level: level,
                                num: 2,
                                srcType: "talent"
                            }
                        }
                    };
                } else {
                    result.willpower_mods = {
                        ...result.willpower_mods,
                        base: {
                            ...result.willpower_mods.base,
                            [talentObj.id]: {
                                level: level,
                                num: 1,
                                srcType: "talent"
                            }
                        }
                    };
                }
            }

            talentObj.various_bonuses.forEach((bonusObj) => {
                if (bonusObj.type === "Synergy") {
                    if (!result.synergy_bonuses[bonusObj.skill]) result.synergy_bonuses[bonusObj.skill] = [];
                    result.synergy_bonuses = {
                        ...result.synergy_bonuses,
                        [bonusObj.skill]: [
                            ...result.synergy_bonuses[bonusObj.skill],
                            {
                                to: bonusObj.to,
                                display: getDisplayName(bonusObj.to),
                                primary: false,
                                source: talentObj.id,
                                srcType: "talent"
                            }
                        ]
                    }
                } else if (gc.skills_list.includes(bonusObj.to)) {
                    result.skill_mods[bonusObj.to] = {
                        ...result.skill_mods[bonusObj.to],
                        [bonusObj.type]: {
                            ...result.skill_mods[bonusObj.to][bonusObj.type],
                            [talentObj.id]: {
                                ...bonusObj,
                                level,
                                srcType: "talent"
                            }
                        }
                    }
                } else {
                    result[bonusObj.to] = {
                        ...result[bonusObj.to],
                        [bonusObj.type]: {
                            ...result[bonusObj.to][bonusObj.type],
                            [talentObj.id]: {
                                ...bonusObj,
                                level: level,
                                srcType: "talent"
                            }
                        }
                    }
                }
            });
            talentObj.various_penalties.forEach((penaltyObj) => {
                if (gc.skills_list.includes(penaltyObj.to)) {
                    if (!result.skill_mods[penaltyObj.to][penaltyObj.type]) {
                        result.skill_mods[penaltyObj.to][penaltyObj.type] = {};
                    }
                    result.skill_mods[penaltyObj.to] = {
                        ...result.skill_mods[penaltyObj.to],
                        [penaltyObj.type]: {
                            ...result.skill_mods[penaltyObj.to][penaltyObj.type],
                            [talentObj.id]: {
                                level,
                                num: penaltyObj.num,
                                srcType: "talent"
                            }
                        }
                    };
                } else {
                    result[penaltyObj.to] = {
                        ...result[penaltyObj.to],
                        [penaltyObj.type]: {
                            ...result[penaltyObj.to][penaltyObj.type],
                            [talentObj.id]: {
                                level,
                                num: penaltyObj.num,
                                srcType: "talent"
                            }
                        }
                    }
                }
            });

            result = {
                ...result,
                passives: [
                    ...result.passives,
                    ...Object.keys(talentObj.selected_options).flatMap((optionType) => {
                        if (optionType === "selectivePassives") {
                            const selectedOption = talentObj.selected_options[optionType];
                            return [{
                                text: talentObj.selective_passives[selectedOption],
                                src: talentObj.id,
                                srcType: "talent",
                                displaySource: talentObj.name,
                                drawback: false
                            }];
                        } else return [];
                    })
                ]
            };
            talentsAlreadyChecked.push(talentObj.id);
        });
    });

    result = updateSynergies(result);               // Includes updateVariousMods()
    result = updateWealth(result);
    if (talentsAlreadyChecked.includes("magearmor")) {
        result = updateMageArmor(result);
        result = updateMpMax(result);
    }
    return result;
}

export const updateVariousMods = (statsObj) => {
    let result = { ...statsObj };
    result = updateSize(result);            // Includes some other updates
    result = updateAwesome(result);
    result = updateGoodSave(result);
    result = updateMpMax(result);
    result = updateRpMax(result);
    result = updateSkillMods(result);
    result = updateSpeed(result);
    result = updateSpellcraft(result);
    result = updateVpMax(result);

    return result;
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

export const updateWealth = (statsObj) => {
    let wealth = gc.base_initial_wealth + mineModifiers(statsObj.wealth_mods, {});
    let result = { ...statsObj };
    if (wealth < 0) {
        result.wealth_mods.buy_history = [
            ...result.wealth_mods.buy_history,
            {
                num: 0 - wealth,
                srcType: "Zero_Min"
            }
        ];
        wealth = 0;
    }
    return updateEncumbrance({
        ...result,
        wealth
    });
}

export const updateXp = (statsObj) => {
    const xpPerParcel = gc.xp_per_parcel;

    const origLevel = statsObj.level;
    const origParcelTotal = statsObj.xp_parcels_total;
    
    const xp_parcels_total = mineParcels(statsObj.kits);
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
    if (xp_parcels_total !== origParcelTotal && statsObj.traits_from_kits.includes("Skill Ranks for Parcels")) {
        result = updateSkillRanks(result);
    }
    return result;
}