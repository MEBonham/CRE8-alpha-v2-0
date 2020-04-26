import React, { useState, useEffect, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import MyButton from '../ui/MyButton';
import BuildLibraryKits from './BuildLibraryKits';
import BuildLibraryFeats from './BuildLibraryFeats';
import BuildLibraryTalents from './BuildLibraryTalents';
import BuildLibraryItems from './BuildLibraryItems';

const BuildLibrary = () => {
    const [state] = useContext(Store);

    const [mode, setMode] = useState("Items");
    const setBuildLibraryMode = (ev) => {
        const selected = ev.target.id.split("_")[2];
        if (selected === "Items" || (state.user && (state.user.rank === "archon" || state.user.rank === "admin"))) {
            setMode(selected);
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
                        <h2>You do not have sufficient account rank to build most parts of the Library.</h2>
                    : null}
                </header>
                <div className="columns">
                    <MyButton fct={setBuildLibraryMode} evData="meb_setLibraryModeBtn_Kits">Kits</MyButton>
                    <MyButton fct={setBuildLibraryMode} evData="meb_setLibraryModeBtn_Feats">Feats</MyButton>
                    <MyButton fct={setBuildLibraryMode} evData="meb_setLibraryModeBtn_Talents">Talents</MyButton>
                    <MyButton fct={setBuildLibraryMode} evData="meb_setLibraryModeBtn_Items">Items</MyButton>
                </div>
            </header>
            {inner}
        </>
    );
}

export default BuildLibrary;