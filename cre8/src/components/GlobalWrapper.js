import React, { useReducer, createContext } from 'react';

import Reducer from '../hooks/Reducer';

const initialData = {
    activeTabs: {},
    characterCache: [],
    editPrivilege: false,
    initialMount: true,
    mainNavMenuOpen: false,
    shouldUpdateCharacterCache: true,
    userSettingsMenuOpen: false
};

export const Store = createContext(initialData);

const GlobalWrapper = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialData);
    return (
        <Store.Provider value={[state, dispatch]}>
            {children}
        </Store.Provider>
    );
}

export default GlobalWrapper;