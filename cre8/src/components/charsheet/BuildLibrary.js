import React, { useState, useEffect, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import useLsPersistedState from '../../hooks/useLsPersistedState';
import MyButton from '../ui/MyButton';
import BuildLibraryKits from './BuildLibraryKits';
import BuildLibraryFeats from './BuildLibraryFeats';
import BuildLibraryTalents from './BuildLibraryTalents';
import BuildLibraryItems from './BuildLibraryItems';
import BuildLibraryRituals from './BuildLibraryRituals';

const BuildLibrary = () => {
    const [state] = useContext(Store);
    const LS_KEY = "buildLibraryTabs";

    const [mode, setMode] = useLsPersistedState(LS_KEY, "Items");
    const setBuildLibraryMode = (ev) => {
        const selectedVal = ev.target.id.split("_")[2];
        if (selectedVal === "Items" || (state.user && (state.user.rank === "archon" || state.user.rank === "admin"))) {
            setMode(selectedVal);
        }
    }

    const [inner, setInner] = useState(null);
    useEffect(() => {
        switch (mode) {
            case "Kits":
                setInner(<BuildLibraryKits />);
                break;
            case "Feats":
                setInner(<BuildLibraryFeats />);
                break;
            case "Talents":
                setInner(<BuildLibraryTalents />);
                break;
            case "Items":
                setInner(<BuildLibraryItems />);
                break;
            case "Rituals":
                setInner(<BuildLibraryRituals />);
                break;
            default:
                setInner(null);
        }

        document.querySelectorAll(".parchment .build-library .my-button").forEach(button => {
            button.classList.remove("selected");
        });
        const string = `meb_setLibraryModeBtn_${mode}`;
        document.getElementById(string).parentNode.classList.add("selected");

    }, [mode])

    return (
        <>
            <header className="build-library">
                <header>
                    <h1>{state.cur.name}</h1>
                    {!state.user || state.user.rank === "peasant" ?
                        <h2>You do not have sufficient account rank to add to the Library.</h2>
                    : null}
                </header>
                <div className="columns">
                    <MyButton fct={setBuildLibraryMode} evData="meb_setLibraryModeBtn_Kits">Kits</MyButton>
                    <MyButton fct={setBuildLibraryMode} evData="meb_setLibraryModeBtn_Feats">Feats</MyButton>
                    <MyButton fct={setBuildLibraryMode} evData="meb_setLibraryModeBtn_Talents">Talents</MyButton>
                    <MyButton fct={setBuildLibraryMode} evData="meb_setLibraryModeBtn_Items">Items</MyButton>
                    <MyButton fct={setBuildLibraryMode} evData="meb_setLibraryModeBtn_Rituals">Rituals</MyButton>
                </div>
            </header>
            {inner}
        </>
    );
}

export default BuildLibrary;