import React, { useReducer, createContext } from 'react';



const reducer = (state, action) => {
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

const initialData = {
    dummy: null
};

const GlobalWrapper = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialData);
    return(
        <StoreContext.Provider value={{state, dispatch}}>
            {children}
        </StoreContext.Provider>
    );
}

export const StoreContext = createContext(null);
export default GlobalWrapper;