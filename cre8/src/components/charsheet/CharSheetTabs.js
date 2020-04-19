import React, { useState, useEffect } from 'react';
import useGlobal from '../../hooks/useGlobal';

const CharSheetTabs = () => {
    const classInactive = "char-sheet-tab";
    const classActive = "char-sheet-tab active";

    const [cur, setCur] = useGlobal("cur");
    const [tab, setTab] = useState(null);
    useEffect(() => {
        setTab(cur.activeTab);
    }, [cur])

    const tabClick = (ev) => {
        const setStr = ev.target.id.split("_")[1];
        setCur({
            ...cur,
            activeTab: setStr
        });
    }

    return(
        <div className="char-sheet-tabs">
            <span onClick={tabClick} id="main-tab_play" className={tab === "play" ? classActive : classInactive}>Play</span>
            <span onClick={tabClick} id="main-tab_configure" className={tab === "configure" ? classActive : classInactive}>Configure</span>
            <span onClick={tabClick} id="main-tab_bio" className={tab === "bio" ? classActive : classInactive}>Bio</span>
            <span onClick={tabClick} id="main-tab_+library" className={tab === "+library" ? classActive : classInactive}>+Library</span>
        </div>
    );
}

export default CharSheetTabs;