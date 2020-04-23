import React, { useState, useEffect, useContext } from 'react';

import { Store } from '../GlobalWrapper';

const CharSheetTabs = () => {
    const [state, dispatch] = useContext(Store);
    const CLASS_INACTIVE = "one-tab";
    const CLASS_ACTIVE = "one-tab active";

    const [tab, setTab] = useState(null);
    useEffect(() => {
        if (state.cur) {
            const activeTabsCopy = {
                [state.cur.id]: (state.editPrivilege ? "configure" :"play"),
                ...state.activeTabs
            };
            setTab(activeTabsCopy[state.cur.id]);
        }
    }, [state.activeTabs, state.editPrivilege, state.cur])

    const tabClick = (ev) => {
        if (state.cur) {
            const setStr = ev.target.id.split("_")[2];
            dispatch({ type: "SET", key: "activeTabs", payload: {
                ...state.activeTabs,
                [state.cur.id]: setStr
            } });
        }
    }

    return(
        <div className="char-sheet-tabs">
            <span onClick={tabClick} id="meb_mainTab_play" className={tab === "play" ? CLASS_ACTIVE : CLASS_INACTIVE}>Play</span>
            <span onClick={tabClick} id="meb_mainTab_configure" className={tab === "configure" ? CLASS_ACTIVE : CLASS_INACTIVE}>Configure</span>
            <span onClick={tabClick} id="meb_mainTab_bio" className={tab === "bio" ? CLASS_ACTIVE : CLASS_INACTIVE}>Bio</span>
            <span onClick={tabClick} id="meb_mainTab_+library" className={tab === "+library" ? CLASS_ACTIVE : CLASS_INACTIVE}>+Library</span>
        </div>
    );
}

export default CharSheetTabs;