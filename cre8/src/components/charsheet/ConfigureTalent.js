import React, { useState, useEffect, useRef, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';

const ConfigureTalent = (props) => {
    const [state, dispatch] = useContext(Store);

    // Protect against memory leak
    const _isMounted = useRef(false);
    useEffect(() => {
        _isMounted.current = true;
        return(() => {
            _isMounted.current = false;
        });
    }, [])

    const [allTalents, setAllTalents] = useState({});
    const [selectTalents, setSelectTalents] = useState({});
    const loadTalents = async () => {
        const allTalentsCopy = {};
        try {
            const query = await fb.db.collection("talents").get();
            query.forEach((doc) => {
                allTalentsCopy[doc.id] = doc.data();
            });
        } catch(err) {
            console.log("Error:", err);
        }
        if (_isMounted) {
            setAllTalents(allTalentsCopy);
        }
    }
    useEffect(() => {
        loadTalents();
    }, [])
    useEffect(() => {
        const selectTalentsCopy = {};
        Object.keys(allTalents).forEach((talentSlug) => {
            const talentData = allTalents[talentSlug];
            selectTalentsCopy[talentSlug] = talentData;
        });
        setSelectTalents(selectTalentsCopy);
    }, [allTalents])

    const [currentTalent, setCurrentTalent] = useState({ id: false });
    useEffect(() => {
        if (state.cur && state.cur.stats.talents && state.cur.stats.talents[props.level]) {
            setCurrentTalent(state.cur.stats.talents[props.level][props.index] || { id: false });
        } else {
            setCurrentTalent({ id: false });
        }
    }, [props.index, props.level, state.cur])

    useEffect(() => {
        const mainSelectEl = document.querySelector(`#meb_editChar_selectTalent_${props.level}_${props.index} select`);
        mainSelectEl.querySelectorAll("option").forEach((optionEl) => {
            optionEl.selected = (optionEl.value === currentTalent.id) ? true : false;
        });
    }, [currentTalent, props.index, props.level, selectTalents])

    const changeTalents = (ev) => {
        const slug = (ev.target.value === "false") ? false : ev.target.value;
        let talentObj;
        if (slug) {
            talentObj = {
                id: slug,
                ...allTalents[slug]
            };
        } else {
            talentObj = {
                id: false
            };
        }
        const talentsObj = state.cur.stats.talents || {};
        talentsObj[props.level] = {
            ...talentsObj[props.level],
            [props.index]: talentObj
        };
        console.log(talentsObj);
        dispatch({ type: "CHAR_EDIT", field: "talents", payload: talentsObj, level: props.level, index: props.index });
    }

    const consumingModeToggle = (ev) => {
        // setCurrentTalent({
        //     ...currentTalent,
        //     selected_options: {
        //         ...currentTalent.selected_options,
        //         consuming_mage_armor: ev.target.checked ? "on" : "off"
        //     }
        // });
        dispatch({
            type: "CHAR_EDIT",
            field: "customizeTalent",
            level: props.level,
            index: props.index,
            property: ev.target.name.split("-")[0],
            payload: ev.target.checked
        });
    }

    return (
        <div className="select-talent" id={`meb_editChar_selectTalent_${props.level}_${props.index}`}>
            <select onChange={changeTalents}>
                <option value={false}>Select Talent{props.flaw ? " (flaw)" : null}</option>
                {Object.keys(selectTalents).sort().map((talentSlug) => (
                    <option key={talentSlug} value={talentSlug} className="non-false">{selectTalents[talentSlug].name}</option>
                ))}
            </select>
            {currentTalent && currentTalent.id === "magearmor" ?
                <div className="checkbox-pair columns">
                    <input
                        type="checkbox"
                        name={`consuming_mage_armor-talentCheckbox-${props.level}-${props.index}`}
                        onChange={consumingModeToggle}
                        defaultChecked={!!currentTalent.selected_options.consuming_mage_armor}
                    />
                    <label>Consuming Mode</label>
                </div>
            : null}
        </div>
    );
}

export default ConfigureTalent;