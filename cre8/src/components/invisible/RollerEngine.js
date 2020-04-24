import { useEffect, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import { roll } from '../../helpers/Roll';

const RollerEngine = () => {
    const [state, dispatch] = useContext(Store);

    // Roll dice as they come through the system
    useEffect(() => {
        if (state.pendingRoll) {
            dispatch({ type: "SET", key: "latestRoll", payload: {
                ...state.pendingRoll,
                resultData: roll(
                    state.pendingRoll.dieMode,
                    state.pendingRoll.dieModBasic,
                    state.pendingRoll.dieModsMisc,
                    state.pendingRoll.coasting
                )
            } });
        }
    }, [dispatch, state.pendingRoll])

    return (null);
}

export default RollerEngine;