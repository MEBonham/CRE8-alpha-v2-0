import { useCallback, useContext } from 'react';
import { StoreContext } from './Store';

const useGlobal = (varName) => {
    const { state, dispatch } = useContext(StoreContext);
    const setFct = useCallback(
        (val) => {
            dispatch({
                type: "SET",
                key: varName,
                payload: val
            });
        }, [dispatch, varName]
    );
    // const initFct = (val) => {
    //     dispatch({
    //         type: "INITIALIZE",
    //         key: varName,
    //         payload: val
    //     });
    // }
    // return [state[varName], setFct, initFct];
    return [state[varName], setFct];
}

export default useGlobal;