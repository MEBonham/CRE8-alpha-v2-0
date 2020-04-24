import { updateXp, updateGoodSave } from '../helpers/Calculations';

const Reducer = (state, action) => {
    switch (action.type) {
        case 'CHAR_EDIT':
            let newVal;
            switch (action.field) {
                case "active_conditions":
                    let newVal = [ ...action.payload ];
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
                case "goodSave":
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