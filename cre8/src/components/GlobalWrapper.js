import React, { useReducer, createContext } from 'react';
import Reducer from '../hooks/Store';

const initialData = {

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