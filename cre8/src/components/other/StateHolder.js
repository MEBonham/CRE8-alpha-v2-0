import { useEffect, useRef, useContext, useCallback } from 'react';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import { roll } from '../../helpers/Roll';

const StateHolder = () => {
    const [state, dispatch] = useContext(Store);
    const AUTOSAVE_INTERVAL = 60 * 1000;                    // Every 1 minute
    const db = fb.db;
    
    // Subscribe to authorization changes
    useEffect(() => {
        let unsubscribeAuth = fb.auth.onAuthStateChanged(user => {
            dispatch({ type: "SET", key: "user", payload: user });
        });

        dispatch({ type: "SET", key: "initialMount", payload: false });

        return(() => {
            unsubscribeAuth();
        });
    }, [dispatch])

    // Pull active campaigns list from database
    const campaignsStream = useRef(null);
    useEffect(() => {
        if (state.user) {
            campaignsStream.current = db.collection("campaigns")
                //.onSnapshot(querySnapshot => {
                .get().then(querySnapshot => {
                    const campaignsInfo = {};
                    // querySnapshot.filter() is not a function, I tried.
                    querySnapshot.forEach(campaign => {
                        if (campaign.data().members.includes(state.user.uid)) {
                            campaignsInfo[campaign.id] = campaign.data();
                        }
                    });
                    dispatch({ type: "SET", key: "activeCampaigns", payload: campaignsInfo });
                })
                .catch((err) => {
                    console.log("Error:", err);
                });
        } else {
            dispatch({ type: "SET", key: "activeCampaigns", payload: {
                standard: {},
                public: {}
            } });
        }
        // if (campaignsStream.current) {
        //     return (() => {
        //         campaignsStream.current();
        //     });
        // }
    }, [db, dispatch, state.user])

    // Initialize EditCharacter global function
    const editCharFct = useCallback((ev, inputs) => {
        const ID_STUB = "meb_charEditVal";
        // Reset the editing form
        const field = ev.target.id.split("_")[2];
        const el = document.getElementById(`${ID_STUB}_${field}`);
        el.value = el.defaultValue;
        // Close the editing form
        document.getElementById(ev.target.id).classList.remove("meb-open");
        // Dispatch the change
        dispatch({ type: "CHAR_EDIT", field, inputs, stub: ID_STUB });
    }, [dispatch]);
    useEffect(() => {
        dispatch({ type: "SET", key: "editCharFct", payload: editCharFct });
    }, [dispatch, editCharFct])

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

export default StateHolder;