import { updateXp } from '../helpers/Calculations';

const Reducer = (state, action) => {
    switch (action.type) {
        case 'CHAR_EDIT':
            const newVal = action.inputs[`${action.stub}_${action.field}`];
            switch (action.field) {
                case "name":
                    return {
                        ...state,
                        curChangesMade: true,
                        cur: {
                            ...state.cur,
                            name: newVal
                        }
                    };
                case "xpBase":
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