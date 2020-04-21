import React, { createContext, useReducer } from 'react';
import Reducer from '../hooks/Store';

const initialData = {
    coasting: false,
    dieRollMode: "normal",
    latestRoll: {},
    userSettingsMenuOpen: false
};

export const Context = createContext(initialData);

const GlobalWrapper = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialData);
    return(
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    );
}

export default GlobalWrapper;