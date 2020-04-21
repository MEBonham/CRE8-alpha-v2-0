
const Reducer = (state, action) => {
    switch (action.type) {
        case 'INITIALIZE':
            const initialState = {};
            initialState[action.key] = action.payload;
            return {
                ...initialState,
                ...state
            };
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

// export const StoreContext = createContext(null);
export default Reducer;