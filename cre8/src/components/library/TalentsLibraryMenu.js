import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import gc from '../../helpers/GameConstants';

const TalentsLibraryMenu = () => {
    const [state, dispatch] = useContext(Store);

    // Protect against memory leak
    const _isMounted = useRef(false);
    useEffect(() => {
        _isMounted.current = true;
        return(() => {
            _isMounted.current = false;
        });
    }, [])

    const [allTalents, setAllTalents] = useState([]);
    useEffect(() => {
        const loadFromDb = async () => {
            const allTalentsCopy = [];
            try {
                const query = await fb.db.collection("talents").get();
                query.forEach(doc => {
                    allTalentsCopy.push({
                        slug: doc.id,
                        name: doc.data().name,
                        tags: doc.data().tags,
                        intended_level: doc.data().intended_level
                    });
                });
                if (_isMounted.current) {
                    setAllTalents(allTalentsCopy);
                }
            } catch(err) {
                console.log("Database error:", err);
            }
        }
        loadFromDb();
    }, [])
    
    const [selectTalents, setSelectTalents] = useState([]);
    useEffect(() => {
        const selectTalentsCopy = [];
        allTalents.forEach((talentObj) => {
            let skip = false;
            if (!state.talentFilters.monster && talentObj.tags.includes("Monster")) skip = true;
            if (state.talentFilters.levelCap && (talentObj.intended_level > state.talentFilters.levelCap)) skip = true;
            if (state.talentFilters.levelCap && state.talentFilters.levelExact && (talentObj.intended_level !== state.talentFilters.levelCap)) skip = true;
            if (state.talentFilters.coreOnly && !talentObj.tags.includes("Core")) skip = true;
            if (state.talentFilters.tagFilter && !talentObj.tags.includes(state.talentFilters.tagFilter)) skip = true;
            if (!skip) {
                selectTalentsCopy.push({
                    ...talentObj
                });
            }
        });
        setSelectTalents(
            selectTalentsCopy.sort((a, b) => {
                if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
                if (a.name.toUpperCase() > b.name.toUpperCase()) return 1;
                return 0;
            })
        );
    }, [allTalents, state.talentFilters])
    
    useEffect(() => {
        Object.keys(state.talentFilters).forEach((property) => {
            const el = document.getElementById(`meb_talentFilters_${property}`);
            if (el.type === "checkbox") {
                el.checked = state.talentFilters[property];
            } else {
                el.value = state.talentFilters[property];
            }
        });
    }, [state.talentFilters])

    useEffect(() => {
        if (selectTalents) {
            dispatch({ type: "SET", key: "talentCycleLinks", payload:
                selectTalents });
        }
    }, [selectTalents, dispatch])

    const handleChange = (ev) => {
        let value = (ev.target.type === "checkbox") ? ev.target.checked : ev.target.value;
        const property = ev.target.id.split("_")[2];
        if (property === "levelCap") {
            value = parseInt(value);
        }
        dispatch({ type: "SET", key: "talentFilters", payload: {
            ...state.talentFilters,
            [property]: value
        } });
    }
    const tagSelect = (ev) => {
        const value = (ev.target.value === "false") ? false : ev.target.value;
        dispatch({ type: "SET", key: "talentFilters", payload: {
            ...state.talentFilters,
            tagFilter: value
        } });
    }
    
    return (
        <section className="links columns space-between">
            <div className="rows">
                <h2>Talents</h2>
                {selectTalents.map((talentObj) => (
                    <Link to={`talents/${talentObj.slug}`} key={talentObj.slug}>{talentObj.name}</Link>
                ))}
            </div>
            <div className="filters rows">
                <div className="checkbox-pair">
                    <input
                        type="checkbox"
                        id="meb_talentFilters_coreOnly"
                        onChange={handleChange}
                    />
                    <label>Show [Core] Only</label>
                </div>
                <div className="checkbox-pair">
                    <input
                        type="checkbox"
                        id="meb_talentFilters_monster"
                        onChange={handleChange}
                        disabled={state.talentFilters.coreOnly}
                    />
                    <label>Show [Monster] Abilities</label>
                </div>
                <div className="columns num-input">
                    <label>Available at Level: (0 to disable)</label>
                    <input
                        type="number"
                        id="meb_talentFilters_levelCap"
                        onChange={handleChange}
                        className="short"
                    />
                </div>
                <div className="checkbox-pair">
                    <input
                        type="checkbox"
                        id="meb_talentFilters_levelExact"
                        onChange={handleChange}
                    />
                    <label>Available at <em>exactly</em> above level</label>
                </div>
                <div>
                    <select
                        id="meb_talentFilters_tagFilter"
                        onChange={tagSelect}
                    >
                        <option value={false}>Select Tag</option>
                        {gc.talent_tags.map((tagName) => (
                            <option key={tagName} value={tagName}>{tagName}</option>
                        ))}
                    </select>
                </div>
            </div>
        </section>
    );
}

export default TalentsLibraryMenu;