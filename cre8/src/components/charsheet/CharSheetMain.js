import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import CharSheetTabs from './CharSheetTabs';
import Play from './Play';
import Configure from './Configure';
import Bio from './Bio';
import BuildLibrary from './BuildLibrary';

const CharSheetMain = () => {
    const [state, dispatch] = useContext(Store);

    const [tab, setTab] = useState(state.editPrivilege ? "configure" : "play");
    const slugRef = useRef(null);
    const loadActiveTabs = useCallback(async () => {
        try {
            let doc = await fb.db.collection("activeTabs").doc(state.user.uid).get();
            if (!doc.exists) doc = {};
            const prevTabs = state.activeTabs ? { ...state.activeTabs } : {};
            return {
                ...doc.data(),
                ...prevTabs
            };
        } catch(err) {
            console.log("Error loading activeTabs from db:", err);
        }
    }, [state.activeTabs, state.user])
    useEffect(() => {
        if (state.cur && state.user && state.cur.id !== slugRef.current) {
            slugRef.current = state.cur.id;
            loadActiveTabs().then((newVal) => {
                dispatch({ type: "SET", key: "activeTabs", payload: newVal });
            }).catch((err) => {
                console.log("Error:", err);
            })
        }
    }, [dispatch, loadActiveTabs, state.cur, state.user])

    useEffect(() => {
        if (state.cur && state.activeTabs) {
            setTab(state.activeTabs[state.cur.id]);
        }
    }, [state.activeTabs, state.cur])
    const tabContents = () => {
        if (state.cur) {
            switch (tab) {
                case "configure":
                    return <Configure />;
                case "bio":
                    return <Bio />;
                case "+library":
                    return <BuildLibrary />;
                default:
                    return <Play />;
            }
        } else {
            return null;
        }
    }
    
    return (
        <div onKeyDown={state.keyShortcutsFct} className="parchment">
            <CharSheetTabs />
            <div className="parchment-padding">
                {tabContents()}
            </div>
        </div>
    );
}

export default CharSheetMain;