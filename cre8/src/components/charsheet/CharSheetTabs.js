import React, { useState, useEffect, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import useLsPersistedState from '../../hooks/useLsPersistedState';

const CharSheetTabs = () => {
    const [state, dispatch] = useContext(Store);
    const LS_KEY = "activeTabs";
    const CLASS_INACTIVE = "one-tab";
    const CLASS_ACTIVE = "one-tab active";

    const [activeTabs, setActiveTabs] = useLsPersistedState(LS_KEY, {});
    const [userId, setUserId] = useState("guest");
    useEffect(() => {
        const newUserId = state.user ? state.user.uid : "guest";
        if (!activeTabs[newUserId]) {
            setActiveTabs({
                ...activeTabs,
                [newUserId]: {}
            })
        }
        setUserId(newUserId);
    }, [activeTabs, setActiveTabs, state.user])

    useEffect(() => {
        if (state.cur && activeTabs[userId]) {
            dispatch({ type: "SET", key: "charSheetTab", payload: (
                activeTabs[userId][state.cur.id] ? activeTabs[userId][state.cur.id] : null
            ) });
        }
    }, [activeTabs, dispatch, state.cur, userId])

    useEffect(() => {
        const defaultString = (state.editPrivilege ? "configure" :"play");
        if (state.cur && activeTabs[userId] && !activeTabs[userId][state.cur.id]) {
            setActiveTabs({
                ...activeTabs,
                [userId]: {
                    ...activeTabs[userId],
                    [state.cur.id]: defaultString
                }
            });
        }
        if (state.cur && !state.charSheetTab) {
            dispatch({ type: "SET", key: "charSheetTab", payload: defaultString });
        }
    }, [activeTabs, dispatch, setActiveTabs, state.charSheetTab, state.cur, state.editPrivilege, userId])

    const tabClick = (ev) => {
        if (state.cur) {
            const setStr = ev.target.id.split("_")[2];
            dispatch({ type: "SET", key: "charSheetTab", payload: setStr });
            setActiveTabs({
                ...activeTabs,
                [userId]: {
                    ...activeTabs[userId],
                    [state.cur.id]: setStr
                }
            });
        }
    }

    return(
        <div className="char-sheet-tabs">
            <span onClick={tabClick} id="meb_mainTab_play" className={state.charSheetTab === "play" ? CLASS_ACTIVE : CLASS_INACTIVE}>Play</span>
            <span onClick={tabClick} id="meb_mainTab_configure" className={state.charSheetTab === "configure" ? CLASS_ACTIVE : CLASS_INACTIVE}>Configure</span>
            <span onClick={tabClick} id="meb_mainTab_bio" className={state.charSheetTab === "bio" ? CLASS_ACTIVE : CLASS_INACTIVE}>Bio</span>
            <span onClick={tabClick} id="meb_mainTab_+library" className={state.charSheetTab === "+library" ? CLASS_ACTIVE : CLASS_INACTIVE}>+Library</span>
        </div>
    );
}

export default CharSheetTabs;