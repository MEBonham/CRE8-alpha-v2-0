import React, { useState, useEffect, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';

const ConfigureKit = (props) => {
    const [state, dispatch] = useContext(Store);

    const [allKits, setAllKits] = useState({});
    const [selectKits, setSelectKits] = useState({});
    const loadKits = async () => {
        const allKitsCopy = {};
        try {
            const query = await fb.db.collection("kits").get();
            query.forEach((doc) => {
                allKitsCopy[doc.id] = doc.data();
            });
        } catch(err) {
            console.log("Error:", err);
        }
        setAllKits(allKitsCopy);
    }
    useEffect(() => {
        loadKits();
    }, [])
    useEffect(() => {
        const selectKitsCopy = {};
        Object.keys(allKits).forEach((kitSlug) => {
            const kitData = allKits[kitSlug];
            selectKitsCopy[kitSlug] = kitData;
        });
        setSelectKits(selectKitsCopy);
    }, [allKits])

    const [currentKit, setCurrentKit] = useState({ id: false });
    useEffect(() => {
        if (state.cur && state.cur.stats.kits && state.cur.stats.kits[props.level]) {
            setCurrentKit(state.cur.stats.kits[props.level][props.index] || { id: false });
        } else {
            setCurrentKit({ id: false });
        }
    }, [props.index, props.level, state.cur])

    useEffect(() => {
        const el = document.querySelector(`#meb_editChar_selectKit_${props.level}_${props.index} select`);
        el.querySelectorAll("option").forEach((optionEl) => {
            optionEl.selected = (optionEl.value === currentKit.id) ? true : false;
        });
    }, [currentKit, props.index, props.level, selectKits])

    const changeKits = (ev) => {
        const slug = (ev.target.value === "false") ? false : ev.target.value;
        let kitObj;
        if (slug) {
            kitObj = {
                id: slug,
                ...allKits[slug]
            };
        } else {
            kitObj = {
                id: false
            };
        }
        const kitsObj = state.cur.stats.kits || {};
        kitsObj[props.level] = {
            ...kitsObj[props.level],
            [props.index]: kitObj
        };
        dispatch({ type: "CHAR_EDIT", field: "kits", payload: kitsObj });
    }

    return (
        <div className="select-kit" id={`meb_editChar_selectKit_${props.level}_${props.index}`}>
            <select onChange={changeKits}>
                <option value={false}>Select Kit</option>
                {Object.keys(selectKits).sort().map((kitSlug) => (
                    <option key={kitSlug} value={kitSlug} className="non-false">{selectKits[kitSlug].name}</option>
                ))}
            </select>
        </div>
    );
}

export default ConfigureKit;