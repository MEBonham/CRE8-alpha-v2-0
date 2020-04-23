
const Reducer = (state, action) => {
    switch (action.type) {
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
        case 'UPDATE_CUR':
            // TODO: Cache outgoing cur object
            return {
                ...state,
                cur: action.payload
            };
        default:
            return state;
    }
}

export default Reducer;