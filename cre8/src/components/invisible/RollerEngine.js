import { useEffect, useRef, useContext, useCallback } from 'react';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import { roll } from '../../helpers/Roll';

const RollerEngine = () => {
    const [state, dispatch] = useContext(Store);
    const ROLL_INTERVAL = 1700;

    // Roll dice as they come through the system
    useEffect(() => {
        if (state.pendingRoll) {
            dispatch({ type: "ROLL_TO_QUEUE", local: true, payload: {
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

    // Save new rolls to db
    useEffect(() => {
        if (state.latestRoll && !state.latestRoll.processedLocally) {
            const processedArr = state.user ?
                [ ...state.latestRoll.processedBy, state.user.uid ] :
                [ ...state.latestRoll.processedBy ];
            const latestRollCopy = {
                ...state.latestRoll,
                processedLocally: true,
                processedBy: processedArr
            }
            const { id } = latestRollCopy;
            delete latestRollCopy.id;
            fb.db.collection("rolls").doc(id).set(latestRollCopy);
        }
    }, [state.latestRoll, state.user])

    // Process built-up queue of incoming die rolls
    const lastRollGated = useRef(Date.now());
    const scheduleGate = useCallback(async () => {
        try {
            setTimeout(() => {
                dispatch({ type: "GATE_ROLL" });
                lastRollGated.current = Date.now();
            }, ROLL_INTERVAL);
        } catch(err) {
            console.log("Error gating roll queue:", err);
        }
    }, [dispatch]);
    useEffect(() => {
        if (state.rollQueue.length) {
            if (Date.now() - lastRollGated.current > ROLL_INTERVAL) {
                dispatch({ type: "GATE_ROLL" });
                lastRollGated.current = Date.now();
            } else {
                scheduleGate();
            }
        }
    }, [dispatch, scheduleGate, state.rollQueue])

    return (null);
}

export default RollerEngine;