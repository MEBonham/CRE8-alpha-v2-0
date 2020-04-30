import { updateKits, updateXp, updateGoodSave, updateSkillRanks, updateSynergies } from '../helpers/Calculations';

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
                                                [action.property]: action.payload
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
                                xp_base: state.cur.stats.xp_base + parseInt(newVal)
                            })
                        }
                    };
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
                            type: "kit",
                            data: action.payload[action.level][action.index]
                        }
                    }
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
                    for (let i = 0; i <= action.level; i++) {
                        if (newVal[i] === undefined) {
                            newVal[i] = [];
                        }
                        while (newVal[i].length < gc.skill_ranks_per_level) {
                            newVal[i].push(null);
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
                case "trained_skills_history":
                    newVal = {
                        ...state.cur.stats.trained_skills_history,
                        [action.level]: {
                            ...state.cur.stats.trained_skills_history[action.level],
                            [action.src]: action.payload
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
                            stats: {
                                ...state.cur.stats,
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
            action.elementToReset.value = "normal";
            return {
                ...state,
                pendingRoll: action.payload,
                dieRollMode: "normal"
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