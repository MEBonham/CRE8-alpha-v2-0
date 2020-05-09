import { updateFeats, updateGoodSave, updateKits, updateSkillRanks, updateSynergies, updateTalents, updateXp, updateWealth } from '../helpers/Calculations';

import gc from '../helpers/GameConstants';

const Reducer = (state, action) => {
    switch (action.type) {
        case 'CHAR_EDIT':
            let newVal;
            switch (action.field) {
                case "active_conditions":
                    newVal = [ ...action.payload ];
                    if (newVal.includes("Shaken") && newVal.includes("Momentum")) {
                        newVal.splice(newVal.indexOf("Momentum"), 1);
                    }
                    return {
                        ...state,
                        curChangesMade: true,
                        cur: {
                            ...state.cur,
                            stats: {
                                ...state.cur.stats,
                                active_conditions: newVal
                            }
                        }
                    };
                case "coasting":
                    return {
                        ...state,
                        cur: {
                            ...state.cur,
                            coasting: action.payload
                        }
                    };
                case "customizeKit":
                    let property;
                    if (action.property.startsWith("trainedSkill")) {
                        property = action.property.split("_")[0];
                        const arrIndex = parseInt(action.property.split("_")[1]);
                        let tempArray = [];
                        if (state.cur.stats.kits[action.level][action.index].selected_options[property]) {
                            tempArray = [ ...state.cur.stats.kits[action.level][action.index].selected_options[property] ];
                        }
                        while (tempArray.length < arrIndex) {
                            tempArray.push(false);
                        }
                        tempArray[arrIndex] = action.payload;
                        newVal = tempArray;
                    } else {
                        property = action.property;
                        newVal = action.payload;
                    }
                    return {
                        ...state,
                        curChangesMade: true,
                        cur: {
                            ...state.cur,
                            stats: updateKits({
                                ...state.cur.stats,
                                kits: {
                                    ...state.cur.stats.kits,
                                    [action.level]: {
                                        ...state.cur.stats.kits[action.level],
                                        [action.index]: {
                                            ...state.cur.stats.kits[action.level][action.index],
                                            selected_options: {
                                                ...state.cur.stats.kits[action.level][action.index].selected_options,
                                                [property]: newVal
                                            }
                                        }
                                    }
                                }
                            })
                        }
                    };
                case "customizeTalent":
                    newVal = (action.property === "consuming_mage_armor") ? (action.payload ? "on" : "off") : action.payload;
                    return {
                        ...state,
                        curChangesMade: true,
                        cur: {
                            ...state.cur,
                            stats: updateTalents({
                                ...state.cur.stats,
                                talents: {
                                    ...state.cur.stats.talents,
                                    [action.level]: {
                                        ...state.cur.stats.talents[action.level],
                                        [action.index]: {
                                            ...state.cur.stats.talents[action.level][action.index],
                                            selected_options: {
                                                ...state.cur.stats.talents[action.level][action.index].selected_options,
                                                [action.property]: newVal
                                            }
                                        }
                                    }
                                }
                            })
                        }
                    };
                case "earnXp":
                    newVal = action.inputs[`${action.stub}_${action.field}`];
                    return {
                        ...state,
                        curChangesMade: true,
                        cur: {
                            ...state.cur,
                            stats: updateXp({
                                ...state.cur.stats,
                                xp_base: state.cur.stats.xp_base + Math.max(0, parseInt(newVal) - state.cur.stats.xp_buffer)
                            })
                        }
                    };
                case "epithet":
                    newVal = action.inputs[`${action.stub}_${action.field}`];
                    return {
                        ...state,
                        curChangesMade: true,
                        cur: {
                            ...state.cur,
                            stats: {
                                ...state.cur.stats,
                                epithet: newVal
                            }
                        }
                    };
                case "feats":
                    return {
                        ...state,
                        curChangesMade: true,
                        cur: {
                            ...state.cur,
                            stats: updateFeats({
                                ...state.cur.stats,
                                feats: action.payload
                            })
                        },
                        preview: {
                            type: "feats",
                            data: action.payload[action.level][action.index]
                        }
                    }
                case "good_save":
                    return {
                        ...state,
                        curChangesMade: true,
                        cur: {
                            ...state.cur,
                            stats: updateGoodSave({
                                ...state.cur.stats,
                                good_save: action.payload
                            })
                        }
                    };
                case "kits":
                    return {
                        ...state,
                        curChangesMade: true,
                        cur: {
                            ...state.cur,
                            stats: updateKits({
                                ...state.cur.stats,
                                kits: action.payload
                            })
                        },
                        preview: {
                            type: "kits",
                            data: action.payload[action.level][action.index]
                        }
                    }
                case "monster_flag":
                    return {
                        ...state,
                        curChangesMade: true,
                        cur: {
                            ...state.cur,
                            monster_flag: action.payload
                        }
                    };
                case "mp":
                    newVal = parseInt(action.inputs[`${action.stub}_${action.field}`]);
                    return {
                        ...state,
                        curChangesMade: true,
                        cur: {
                            ...state.cur,
                            stats: {
                                ...state.cur.stats,
                                mp: Math.min(Math.max(0, state.cur.stats.mp + newVal), state.cur.stats.mp_max)
                            }
                        }
                    };
                case "name":
                    newVal = action.inputs[`${action.stub}_${action.field}`];
                    return {
                        ...state,
                        curChangesMade: true,
                        cur: {
                            ...state.cur,
                            name: newVal
                        }
                    };
                case "primary_synergy":
                    newVal = state.cur.stats.synergy_bonuses[action.skill];
                    newVal.forEach((synergyBonus, i) => {
                        newVal[i].primary = (synergyBonus.to === action.primary);
                    });
                    return {
                        ...state,
                        curChangesMade: true,
                        cur: {
                            ...state.cur,
                            stats: updateSynergies({
                                ...state.cur.stats,
                                synergy_bonuses: {
                                    ...state.cur.stats.synergy_bonuses,
                                    [action.skill]: newVal
                                }
                            })
                        }
                    };
                case "rp":
                    newVal = parseInt(action.inputs[`${action.stub}_${action.field}`]);
                    return {
                        ...state,
                        curChangesMade: true,
                        cur: {
                            ...state.cur,
                            stats: {
                                ...state.cur.stats,
                                rp: Math.min(Math.max(0, state.cur.stats.rp + newVal), state.cur.stats.rp_max)
                            }
                        }
                    };
                case "skill_ranks_history":
                    let skill = gc.skills_list.includes(action.skill) ? action.skill : null;
                    newVal = state.cur.stats.skill_ranks_history;
                    if (action.level === "bonus") {
                        if (!state.cur.stats.skill_ranks_history.bonus) {
                            newVal.bonus = [];
                        }
                        while (newVal.bonus.length <= state.cur.stats.xp_parcels_total) {
                            newVal.bonus.push(null);
                        }
                    } else {
                        for (let i = 0; i <= action.level; i++) {
                            if (newVal[i] === undefined) {
                                newVal[i] = [];
                            }
                            while (newVal[i].length < gc.skill_ranks_per_level) {
                                newVal[i].push(null);
                            }
                        }
                    }
                    newVal[action.level][action.col] = skill;
                    return {
                        ...state,
                        curChangesMade: true,
                        cur: {
                            ...state.cur,
                            stats: updateSkillRanks({
                                ...state.cur.stats,
                                skill_ranks_history: newVal
                            })
                        }
                    };
                case "talents":
                    return {
                        ...state,
                        curChangesMade: true,
                        cur: {
                            ...state.cur,
                            stats: updateTalents({
                                ...state.cur.stats,
                                talents: action.payload
                            })
                        },
                        preview: {
                            type: "talents",
                            data: action.payload[action.level][action.index]
                        }
                    }
                case "toggleParcel":
                    newVal = state.cur.stats.kits[action.level][action.index].xp_parcels_acquired || [];
                    while (newVal.length <= action.parcelNum) {
                        newVal.push(false);
                    }
                    newVal[action.parcelNum] = action.payload;
                    return {
                        ...state,
                        curChangesMade: true,
                        cur: {
                            ...state.cur,
                            stats: updateXp({
                                ...state.cur.stats,
                                kits: {
                                    ...state.cur.stats.kits,
                                    [action.level]: {
                                        ...state.cur.stats.kits[action.level],
                                        [action.index]: {
                                            ...state.cur.stats.kits[action.level][action.index],
                                            xp_parcels_acquired: newVal
                                        }
                                    }
                                }
                            })
                        }
                    }
                case "trained_skills_history":
                    newVal = {
                        ...state.cur.stats.trained_skills_history,
                        [action.level]: {
                            ...state.cur.stats.trained_skills_history[action.level],
                            [action.src]: {
                                skill: action.payload,
                                srcType: action.srcType
                            }
                        }
                    };
                    return {
                        ...state,
                        curChangesMade: true,
                        cur: {
                            ...state.cur,
                            stats: updateSkillRanks({
                                ...state.cur.stats,
                                trained_skills_history: newVal
                            })
                        }
                    };
                case "vp":
                    newVal = parseInt(action.inputs[`${action.stub}_${action.field}`]);
                    return {
                        ...state,
                        curChangesMade: true,
                        cur: {
                            ...state.cur,
                            stats: {
                                ...state.cur.stats,
                                vp: Math.min(Math.max(0, state.cur.stats.vp + newVal), state.cur.stats.vp_max)
                            }
                        }
                    };
                case "wealthAdj":
                    console.log(action.payload);
                    return {
                        ...state,
                        curChangesMade: true,
                        saveButtonHit: true,
                        rollQueue: action.local ?
                            [ action.payload, ...state.rollQueue ] :
                            [ ...state.rollQueue, action.payload ],
                        cur: {
                            ...state.cur,
                            stats: updateWealth({
                                ...state.cur.stats,
                                wealth_undo_used: false,
                                wealth_mods: {
                                    ...state.cur.stats.wealth_mods,
                                    buy_history: [
                                        ...state.cur.stats.wealth_mods.buy_history,
                                        {
                                            num: action.payload.resultData.finalDifference,
                                            srcType: action.payload.name
                                        }
                                    ]
                                }
                            })
                        }
                    }
                case "xpBase":
                    newVal = action.inputs[`${action.stub}_${action.field}`];
                    return {
                        ...state,
                        curChangesMade: true,
                        cur: {
                            ...state.cur,
                            stats: updateXp({
                                ...state.cur.stats,
                                xp_base: parseInt(newVal)
                            })
                        }
                    };
                default:
                    newVal = action.inputs[`${action.stub}_${action.field}`];
                    return {
                        ...state,
                        curChangesMade: true,
                        cur: {
                            ...state.cur,
                            bio: {
                                ...state.cur.bio,
                                [action.field]: newVal
                            }
                        }
                    };
            }
        case 'GATE_ROLL':
            const copy = state.rollQueue.slice();
            const val = copy.shift();
            return {
                ...state,
                rollQueue: copy,
                latestRoll: val
            }
        case 'RESOLVE_CUR_SAVE':
            return {
                ...state,
                curChangesMade: false,
                saveButtonHit: false
            };
        case 'ROLL_PENDING':
            if (action.elementToReset) action.elementToReset.value = "normal";
            // Reset dieRollMode if this roll is "using it up," otherwise don't change it:
            const resetMode = (action.payload.dieMode) ? "normal" : state.dieRollMode;
            return {
                ...state,
                pendingRoll: action.payload,
                dieRollMode: resetMode
            };
        case 'ROLL_TO_QUEUE':
            return {
                ...state,
                rollQueue: action.local ?
                    [ action.payload, ...state.rollQueue ] :
                    [ ...state.rollQueue, action.payload ]
            }
        case 'SET':
            const newState = {};
            newState[action.key] = action.payload;
            return {
                ...state,
                ...newState
            };
        case 'SAVE_CHARACTERS_TO_CACHE':
            return {
                ...state,
                characterCache: action.payload,
                shouldUpdateCharacterCache: false
            };
        case 'UPDATE_CUR_FROM_DB':
            // TODO: Cache outgoing cur object
            return {
                ...state,
                cur: action.payload,
                curChangesMade: false
            };
        default:
            return state;
    }
}

export default Reducer;