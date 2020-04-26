import React, { useEffect, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import useLsPersistedState from '../../hooks/useLsPersistedState';

const CharSheetTabs = () => {
    const [state, dispatch] = useContext(Store);
    const LS_KEY = "activeTabs";
    const CLASS_INACTIVE = "one-tab";
    const CLASS_ACTIVE = "one-tab active";

    const [activeTabs, setActiveTabs] = useLsPersistedState(LS_KEY, {});

    useEffect(() => {
        if (state.cur) {
            dispatch({ type: "SET", key: "charSheetTab", payload: (activeTabs[state.cur.id] ? activeTabs[state.cur.id] : null) })
        }
    }, [activeTabs, dispatch, state.cur])

    useEffect(() => {
        const defaultString = (state.editPrivilege ? "configure" :"play");
        if (state.cur && !activeTabs[state.cur.id]) {
            setActiveTabs({
                ...activeTabs,
                [state.cur.id]: defaultString
            });
        }
        if (state.cur && !state.charSheetTab) {
            dispatch({ type: "SET", key: "charSheetTab", payload: defaultString });
        }
    }, [activeTabs, dispatch, setActiveTabs, state.charSheetTab, state.cur, state.editPrivilege])

    // useEffect(() => {
    //     if (state.cur) {
    //         setTab(activeTabs[state.cur.id]);
    //     }
    // }, [activeTabs, state.cur])
    // useEffect(() => {
    //     if (state.cur && state.activeTabs[state.cur.id]) {
    //         const activeTabsCopy = {
    //             [state.cur.id]: (state.editPrivilege ? "configure" :"play"),
    //             ...state.activeTabs
    //         };
    //         setTab(activeTabsCopy[state.cur.id]);
    //     }
    // }, [state.activeTabs, state.editPrivilege, state.cur])

    const tabClick = (ev) => {
        if (state.cur) {
            const setStr = ev.target.id.split("_")[2];
            dispatch({ type: "SET", key: "charSheetTab", payload: setStr });
            setActiveTabs({
                ...activeTabs,
                [state.cur.id]: setStr
            });
            // setActiveTabs({
            //     ...activeTabs,
            //     [state.cur.id]: setStr
            // });
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