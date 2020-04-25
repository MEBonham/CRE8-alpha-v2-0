import { useEffect, useRef, useContext, useCallback } from 'react';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';

const StateSaver = () => {
    const [state, dispatch] = useContext(Store);
    const AUTOSAVE_INTERVAL = 60 * 1000;                    // Every 1 minute
    const db = fb.db;

    // Save data to database
    const lastSaveMoment = useRef(Date.now());
    const curSave = useCallback(async () => {
        if (state.cur) {
            const curCopy = { ...state.cur };
            const slug = curCopy.id;
            delete curCopy.id;
            try {
                await db.collection("characters").doc(slug).set(curCopy);
                lastSaveMoment.current = Date.now();
                dispatch({ type: "RESOLVE_CUR_SAVE" });
                console.log("Saved Current Character");
            } catch(err) {
                console.log("Error while saving:", err);
            }
        }
    }, [db, dispatch, state.cur]);
    const activeTabsChangesMade = useRef(false);
    const activeTabsRef = useRef(state.activeTabs);
    const charTabsSave = useCallback(async () => {
        if (state.cur && state.user && state.activeTabs) {
            try {
                await db.collection("activeTabs").doc(state.user.uid).set(state.activeTabs, { merge: true });
                activeTabsChangesMade.current = false;
                console.log("Saved Current Tabs");
            } catch(err) {
                console.log("Error saving activeTabs to db:", err);
            }
        }
    }, [db, state.activeTabs, state.cur, state.user])
    const checkSaveReqs = useCallback(() => {
        if (state.curChangesMade && (state.saveButtonHit || Date.now() - lastSaveMoment.current > AUTOSAVE_INTERVAL)) {
            curSave();
        } else if (activeTabsChangesMade && Date.now() - lastSaveMoment.current > AUTOSAVE_INTERVAL) {
            charTabsSave();
        }
    }, [AUTOSAVE_INTERVAL, charTabsSave, curSave, state.curChangesMade, state.saveButtonHit]);
    useEffect(() => {
        if (state.curChangesMade) {
            checkSaveReqs();
        }
    }, [checkSaveReqs, state.curChangesMade])
    useEffect(() => {
        if (state.activeTabs !== activeTabsRef.current) {
            activeTabsChangesMade.current = true;
            activeTabsRef.current = state.activeTabs;
            checkSaveReqs();
        }
    }, [checkSaveReqs, state.activeTabs])
    useEffect(() => {
        if (state.saveButtonHit) {
            checkSaveReqs();
        }
    }, [checkSaveReqs, state.saveButtonHit])
    const intervalStream = useRef(null);
    useEffect(() => {
        intervalStream.current = setInterval(() => {
            checkSaveReqs();
        }, AUTOSAVE_INTERVAL);
        return(() => {
            clearInterval(intervalStream.current);
        });
    }, [AUTOSAVE_INTERVAL, checkSaveReqs])

    return (null);
}

export default StateSaver;