import { useContext } from 'react';
import { StoreContext } from './Store';

const useGlobal = (varName) => {
    const { state, dispatch } = useContext(StoreContext);
    const setFct = (val) => {
        dispatch({
            type: "SET",
            key: varName,
            payload: val
        });
    };
    const initFct = (val) => {
        dispatch({
            type: "INITIALIZE",
            key: varName,
            payload: val
        });
    }
    return [state[varName], setFct, initFct];
}

export default useGlobal;