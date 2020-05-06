import React, { useState, useEffect, useRef, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import ConfigureFeat from './ConfigureFeat';
import ConfigureTalent from './ConfigureTalent';

const ConfigureKit = (props) => {
    const [state, dispatch] = useContext(Store);

    // Protect against memory leak
    const _isMounted = useRef(false);
    useEffect(() => {
        _isMounted.current = true;
        return(() => {
            _isMounted.current = false;
        });
    }, [])

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
        if (_isMounted) {
            setAllKits(allKitsCopy);
        }
    }
    useEffect(() => {
        loadKits();
    }, [])
    useEffect(() => {
        const selectKitsCopy = {};
        Object.keys(allKits).forEach((kitSlug) => {
            const kitData = allKits[kitSlug];
            let skip = false;
            if (!props.search.monster && kitData.tags.includes("Monster")) skip = true;
            if (props.search.level_access && (kitData.intended_level - props.level > 1)) skip = true;
            if (!skip) {
                selectKitsCopy[kitSlug] = kitData;
            }
        });
        setSelectKits(selectKitsCopy);
    }, [allKits, props])

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
                if (choice === "trainedSkill") {
                    const innerSelects = mainSelectEl.parentNode.querySelectorAll("select")
                    innerSelects.forEach((innerSelect) => {
                        if (innerSelect.name.startsWith("trainedSkill_")) {
                            const arrIndex = parseInt(innerSelect.name.split("-")[0].split("_")[1]);
                            innerSelect.value = currentKit.selected_options[choice][arrIndex];
                        }
                    });
                } else {
                    const radios = mainSelectEl.parentNode.querySelectorAll(`input[name="${choice}-kit-${props.level}-${props.index}"]`);
                    radios.forEach((radio) => {
                        radio.checked = (radio.value === currentKit.selected_options[choice]);
                    });
                }
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
        console.log(kitsObj);
        dispatch({ type: "CHAR_EDIT", field: "kits", payload: kitsObj, level: props.level, index: props.index });
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

    const changeTrainedSkill = (ev) => {
        dispatch({
            type: "CHAR_EDIT",
            field: "customizeKit",
            level: props.level,
            index: props.index,
            property: ev.target.name.split("-")[0],
            payload: ev.target.value
        });
    }
    const toggleParcelEarned = (ev) => {
        dispatch({
            type: "CHAR_EDIT",
            field: "toggleParcel",
            level: props.level,
            index: props.index,
            parcelNum: parseInt(ev.target.name.split("_")[4]),
            payload: ev.target.checked
        });
    }

    return (
        <div className="select-kit" id={`meb_editChar_selectKit_${props.level}_${props.index}`}>
            <select onChange={changeKits} className="color-coded">
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
                {currentKit && currentKit.fightingRpBoost_OR_rpPlus2 ?
                    <div className="radio-bank rows">
                        <label>Choose one:</label>
                        <div>
                            <input
                                type="radio"
                                name={`fightingRpBoost_OR_rpPlus2-kit-${props.level}-${props.index}`}
                                value="fightingRpBoosts"
                                onChange={radioSelection}
                            /> Fighting Level +1, RP +1
                        </div>
                        <div>
                            <input
                                type="radio"
                                name={`fightingRpBoost_OR_rpPlus2-kit-${props.level}-${props.index}`}
                                value="rpPlus2"
                                onChange={radioSelection}
                            /> Reserve Points +2
                        </div>
                    </div> :
                null}
            </div>
            <div className="selects columns">
                {currentKit && currentKit.bonus_talents && currentKit.bonus_talents.map((bonusTalent, i) => {
                    const key = Object.keys(bonusTalent)[0];
                    const tagFilter = bonusTalent[key];
                    return (
                        <ConfigureTalent
                            key={i}
                            level={props.level}
                            index={`kit${props.index}_${i}`}
                            tagFilter={tagFilter}
                            search={props.search}
                        />
                    );
                })}
                {currentKit && currentKit.bonus_feat ?
                    <ConfigureFeat level={props.level} index={`kit${props.index}`} search={props.search} /> :
                null}
                {currentKit && currentKit.bonus_trained_skills && currentKit.bonus_trained_skills.map((training, i) => {
                    // console.log(training);
                    return (
                        <div className="rows" key={i}>
                            <label>Train a Skill:</label>
                            <select
                                onChange={changeTrainedSkill}
                                name={`trainedSkill_${i}-kit-${props.level}-${props.index}`}
                                disabled={training.type === "specific"}
                            >
                                {training.type !== "specific" && <option value={false}>Select Skill</option>}
                                {training.options.map((skill) => (
                                    <option key={skill} value={skill}>{skill}</option>
                                ))}
                            </select>
                        </div>
                    );
                })}
            </div>
            {currentKit && currentKit.xp_parcels ?
                <div className="parcels rows">
                    {currentKit.xp_parcels.map((parcel, i) => (
                        <div key={i} className="checkbox-pair">
                            <input
                                type="checkbox"
                                name={`meb_parcelEarnedCheckbox_${props.level}_${props.index}_${i}`}
                                onChange={toggleParcelEarned}
                                defaultChecked={currentKit.xp_parcels_acquired[i] || false}
                            />
                            <label>{parcel}</label>
                        </div>
                    ))}
                </div> :
            null}
        </div>
    );
}

export default ConfigureKit;