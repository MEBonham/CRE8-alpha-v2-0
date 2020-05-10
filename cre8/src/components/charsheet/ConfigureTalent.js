import React, { useState, useEffect, useRef, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import { arrayMatch } from '../../helpers/Utilities';

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
        if (_isMounted.current) {
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
            let skip = false;
            if (!props.search.monster && talentData.tags.includes("Monster")) skip = true;
            if (props.search.level_access && (talentData.intended_level - props.level > 1)) skip = true;
            if (props.flaw && !talentData.tags.includes("Flaw")) skip = true;
            if (props.tagFilter && !arrayMatch(props.tagFilter, talentData.tags)) skip = true;
            
            if (!skip) {
                selectTalentsCopy[talentSlug] = talentData;
            }
        });
        setSelectTalents(selectTalentsCopy);
    }, [allTalents, props])

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
        dispatch({ type: "CHAR_EDIT", field: "talents", payload: talentsObj, level: props.level, index: props.index });
    }

    const consumingModeToggle = (ev) => {
        dispatch({
            type: "CHAR_EDIT",
            field: "customizeTalent",
            level: props.level,
            index: props.index,
            property: ev.target.name.split("-")[0],
            payload: ev.target.checked
        });
    }
    const selectOptionalPassives = (ev) => {
        dispatch({
            type: "CHAR_EDIT",
            field: "customizeTalent",
            level: props.level,
            index: props.index,
            property: "selectivePassives",
            payload: ev.target.value
        });
    }

    return (
        <div className="select-talent" id={`meb_editChar_selectTalent_${props.level}_${props.index}`}>
            <select onChange={changeTalents} className="color-coded">
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
            {currentTalent && currentTalent.selective_passives && Object.keys(currentTalent.selective_passives).length ?
                <select
                    onChange={selectOptionalPassives}
                    name={`selective_passives-configureSelect-${props.level}-${props.index}`}
                    defaultValue={currentTalent.selected_options.selectivePassives || false}
                >
                    <option value={false}>Select an Option</option>
                    {Object.keys(currentTalent.selective_passives).sort().map((name) => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
            : null}
        </div>
    );
}

export default ConfigureTalent;