import React, { useState, useEffect, useRef, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';

const ConfigureFeat = (props) => {
    const [state, dispatch] = useContext(Store);

    // Protect against memory leak
    const _isMounted = useRef(false);
    useEffect(() => {
        _isMounted.current = true;
        return(() => {
            _isMounted.current = false;
        });
    }, [])

    const [allFeats, setAllFeats] = useState({});
    const [selectFeats, setSelectFeats] = useState({});
    const loadFeats = async () => {
        const allFeatsCopy = {};
        try {
            const query = await fb.db.collection("feats").get();
            query.forEach((doc) => {
                allFeatsCopy[doc.id] = doc.data();
            });
        } catch(err) {
            console.log("Error:", err);
        }
        if (_isMounted.current) {
            setAllFeats(allFeatsCopy);
        }
    }
    useEffect(() => {
        loadFeats();
    }, [])
    useEffect(() => {
        const selectFeatsCopy = {};
        Object.keys(allFeats).forEach((featSlug) => {
            const featData = allFeats[featSlug];
            let skip = false;
            if (!props.search.monster && featData.tags.includes("Monster")) skip = true;
            if (props.search.level_access && (featData.intended_level - props.level > 1)) skip = true;
            if (!skip) {
                selectFeatsCopy[featSlug] = featData;
            }
        });
        setSelectFeats(selectFeatsCopy);
    }, [allFeats, props])

    const [currentFeat, setCurrentFeat] = useState({ id: false });
    useEffect(() => {
        if (state.cur && state.cur.stats.feats && state.cur.stats.feats[props.level]) {
            setCurrentFeat(state.cur.stats.feats[props.level][props.index] || { id: false });
        } else {
            setCurrentFeat({ id: false });
        }
    }, [props.index, props.level, state.cur])

    useEffect(() => {
        const mainSelectEl = document.querySelector(`#meb_editChar_selectFeat_${props.level}_${props.index} select`);
        mainSelectEl.querySelectorAll("option").forEach((optionEl) => {
            optionEl.selected = (optionEl.value === currentFeat.id) ? true : false;
        });
    }, [currentFeat, props.index, props.level, selectFeats])

    const changeFeats = (ev) => {
        const slug = (ev.target.value === "false") ? false : ev.target.value;
        let featObj;
        if (slug) {
            featObj = {
                id: slug,
                ...allFeats[slug]
            };
        } else {
            featObj = {
                id: false
            };
        }
        const featsObj = state.cur.stats.feats || {};
        featsObj[props.level] = {
            ...featsObj[props.level],
            [props.index]: featObj
        };
        dispatch({ type: "CHAR_EDIT", field: "feats", payload: featsObj, level: props.level, index: props.index });
    }

    const consumingModeToggle = (ev) => {
        dispatch({
            type: "CHAR_EDIT",
            field: "customizeFeat",
            level: props.level,
            index: props.index,
            property: ev.target.name.split("-")[0],
            payload: ev.target.checked
        });
    }

    return (
        <div className="select-feat" id={`meb_editChar_selectFeat_${props.level}_${props.index}`}>
            <select onChange={changeFeats} className="color-coded">
                <option value={false}>Select Feat</option>
                {Object.keys(selectFeats).sort().map((featSlug) => (
                    <option key={featSlug} value={featSlug} className="non-false">{selectFeats[featSlug].name}</option>
                ))}
            </select>
            {currentFeat && currentFeat.id === "mageflight" ?
                <div className="checkbox-pair columns">
                    <input
                        type="checkbox"
                        name={`consuming_mage_flight-featCheckbox-${props.level}-${props.index}`}
                        onChange={consumingModeToggle}
                        defaultChecked={!!currentFeat.selected_options.consuming_mage_armor}
                    />
                    <label>Consuming Mode</label>
                </div>
            : null}
        </div>
    );
}

export default ConfigureFeat;