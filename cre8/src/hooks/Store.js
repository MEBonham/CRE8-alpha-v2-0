
const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET':
            const newState = {};
            newState[action.key] = action.payload;
            return {
                ...state,
                ...newState
            };
        default:
            return state;
    }
}

export default Reducer;