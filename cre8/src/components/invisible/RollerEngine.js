import { useEffect, useRef, useContext, useCallback } from 'react';

import { Store } from '../GlobalWrapper';
import { roll, wealthRoll } from '../../helpers/Roll';

const RollerEngine = () => {
    const [state, dispatch] = useContext(Store);
    const ROLL_INTERVAL = 1700;

    // Roll dice as they come through the system
    useEffect(() => {
        if (state.pendingRoll) {
            if (state.pendingRoll.type === "wealth roll") {
                dispatch({ type: "CHAR_EDIT", field: "wealthAdj", local: true, payload: {
                    ...state.pendingRoll,
                    resultData: wealthRoll(
                        state.pendingRoll.prevWealth,
                        state.pendingRoll.adjustMoneyQty,
                        state.pendingRoll.merchant,
                        state.pendingRoll.haggle
                    )
                } });
            } else {
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
        }
    }, [dispatch, state.pendingRoll])

    // Save new rolls to db
    const uploadRef = useRef(null);
    useEffect(() => {
        uploadRef.current = state.uploadRoll;
    }, [state.uploadRoll])
    useEffect(() => {
        if (state.latestRoll && !state.latestRoll.processedLocally && state.user) {
            uploadRef.current(state.latestRoll, state.user.uid);
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