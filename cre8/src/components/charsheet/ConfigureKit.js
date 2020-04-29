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
        const mainSelectEl = document.querySelector(`#meb_editChar_selectKit_${props.level}_${props.index} select`);
        mainSelectEl.querySelectorAll("option").forEach((optionEl) => {
            optionEl.selected = (optionEl.value === currentKit.id) ? true : false;
        });

        // if (props.index === 0 && props.level === 0) console.log(currentKit.selected_options);
        if (currentKit && currentKit.selected_options) {
            Object.keys(currentKit.selected_options).forEach((choice) => {
                const radios = mainSelectEl.parentNode.querySelectorAll(`input[name="${choice}-kit-${props.level}-${props.index}"]`);
                radios.forEach((radio) => {
                    radio.checked = (radio.value === currentKit.selected_options[choice]);
                });
            });
        }
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

    const radioSelection = (ev) => {
        // console.log(ev.target.name, ev.target.value);
        dispatch({
            type: "CHAR_EDIT",
            field: "customizeKit",
            level: props.level,
            index: props.index,
            property: ev.target.name.split("-")[0],
            payload: ev.target.value
        });
    }

    return (
        <div className="select-kit" id={`meb_editChar_selectKit_${props.level}_${props.index}`}>
            <select onChange={changeKits}>
                <option value={false}>Select Kit</option>
                {Object.keys(selectKits).sort().map((kitSlug) => (
                    <option key={kitSlug} value={kitSlug} className="non-false">{selectKits[kitSlug].name}</option>
                ))}
            </select>
            <div className="columns">
                {currentKit && currentKit.fighting_OR_caster_boost ?
                    <div className="radio-bank rows">
                        <label>Choose one:</label>
                        <div>
                            <input
                                type="radio"
                                name={`fighting_OR_caster_boost-kit-${props.level}-${props.index}`}
                                value="fighting"
                                onChange={radioSelection}
                            /> Fighting Level +1
                        </div>
                        <div>
                            <input
                                type="radio"
                                name={`fighting_OR_caster_boost-kit-${props.level}-${props.index}`}
                                value="caster"
                                onChange={radioSelection}
                            /> Caster Level +1
                        </div>
                    </div> :
                null}
                {currentKit && currentKit.fighting_OR_coast_boost ?
                    <div className="radio-bank rows">
                        <label>Choose one:</label>
                        <div>
                            <input
                                type="radio"
                                name={`fighting_OR_coast_boost-kit-${props.level}-${props.index}`}
                                value="fighting"
                                onChange={radioSelection}
                            /> Fighting Level +1
                        </div>
                        <div>
                            <input
                                type="radio"
                                name={`fighting_OR_coast_boost-kit-${props.level}-${props.index}`}
                                value="coast"
                                onChange={radioSelection}
                            /> Coast Number +1
                        </div>
                    </div> :
                null}
                {currentKit && currentKit.caster_OR_coast_boost ?
                    <div className="radio-bank rows">
                        <label>Choose one:</label>
                        <div>
                            <input
                                type="radio"
                                name={`caster_OR_coast_boost-kit-${props.level}-${props.index}`}
                                value="caster"
                                onChange={radioSelection}
                            /> Caster Level +1
                        </div>
                        <div>
                            <input
                                type="radio"
                                name={`caster_OR_coast_boost-kit-${props.level}-${props.index}`}
                                value="coast"
                                onChange={radioSelection}
                            /> Coast Number +1
                        </div>
                    </div> :
                null}
                {currentKit && currentKit.vpPlus2_OR_mpPlus2 ?
                    <div className="radio-bank rows">
                        <label>Choose one:</label>
                        <div>
                            <input
                                type="radio"
                                name={`vpPlus2_OR_mpPlus2-kit-${props.level}-${props.index}`}
                                value="vpPlus2"
                                onChange={radioSelection}
                            /> Vitality Points +2
                        </div>
                        <div>
                            <input
                                type="radio"
                                name={`vpPlus2_OR_mpPlus2-kit-${props.level}-${props.index}`}
                                value="mpPlus2"
                                onChange={radioSelection}
                            /> Magic Points +2
                        </div>
                    </div> :
                null}
            </div>
        </div>
    );
}

export default ConfigureKit;