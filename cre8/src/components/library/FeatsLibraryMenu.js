import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import gc from '../../helpers/GameConstants';

const FeatsLibraryMenu = () => {
    const [state, dispatch] = useContext(Store);

    // Protect against memory leak
    const _isMounted = useRef(false);
    useEffect(() => {
        _isMounted.current = true;
        return(() => {
            _isMounted.current = false;
        });
    }, [])

    const [allFeats, setAllFeats] = useState([]);
    useEffect(() => {
        const loadFromDb = async () => {
            const allFeatsCopy = [];
            try {
                const query = await fb.db.collection("feats").get();
                query.forEach(doc => {
                    allFeatsCopy.push({
                        slug: doc.id,
                        name: doc.data().name,
                        tags: doc.data().tags,
                        intended_level: doc.data().intended_level
                    });
                });
                if (_isMounted.current) {
                    setAllFeats(allFeatsCopy);
                }
            } catch(err) {
                console.log("Database error:", err);
            }
        }
        loadFromDb();
    }, [])
    
    const [selectFeats, setSelectFeats] = useState([]);
    useEffect(() => {
        const selectFeatsCopy = [];
        allFeats.forEach((featObj) => {
            let skip = false;
            if (!state.featFilters.monster && featObj.tags.includes("Monster")) skip = true;
            if (state.featFilters.levelCap && (featObj.intended_level > state.featFilters.levelCap)) skip = true;
            if (state.featFilters.levelCap && state.featFilters.levelExact && (featObj.intended_level !== state.featFilters.levelCap)) skip = true;
            if (state.featFilters.coreOnly && !featObj.tags.includes("Core")) skip = true;
            // console.log(state.featFilters.tagFilter, skip);
            if (state.featFilters.tagFilter && !featObj.tags.includes(state.featFilters.tagFilter)) skip = true;
            if (!skip) {
                selectFeatsCopy.push({
                    ...featObj
                });
            }
        });
        setSelectFeats(
            selectFeatsCopy.sort((a, b) => {
                if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
                if (a.name.toUpperCase() > b.name.toUpperCase()) return 1;
                return 0;
            })
        );
    }, [allFeats, state.featFilters])
    
    useEffect(() => {
        Object.keys(state.featFilters).forEach((property) => {
            const el = document.getElementById(`meb_featFilters_${property}`);
            if (el.type === "checkbox") {
                el.checked = state.featFilters[property];
            } else {
                el.value = state.featFilters[property];
            }
        });
    }, [state.featFilters])

    useEffect(() => {
        if (selectFeats) {
            dispatch({ type: "SET", key: "featCycleLinks", payload:
                selectFeats });
        }
    }, [selectFeats, dispatch])

    const handleChange = (ev) => {
        let value = (ev.target.type === "checkbox") ? ev.target.checked : ev.target.value;
        const property = ev.target.id.split("_")[2];
        if (property === "levelCap") {
            value = parseInt(value);
        }
        dispatch({ type: "SET", key: "featFilters", payload: {
            ...state.featFilters,
            [property]: value
        } });
    }
    const tagSelect = (ev) => {
        const value = (ev.target.value === "false") ? false : ev.target.value;
        dispatch({ type: "SET", key: "featFilters", payload: {
            ...state.featFilters,
            tagFilter: value
        } });
    }
    
    return (
        <section className="links columns space-between">
            <div className="rows">
                <h2>Feats</h2>
                {selectFeats.map((featObj) => (
                    <Link to={`feats/${featObj.slug}`} key={featObj.slug}>{featObj.name}</Link>
                ))}
            </div>
            <div className="filters rows">
                <div className="checkbox-pair">
                    <input
                        type="checkbox"
                        id="meb_featFilters_coreOnly"
                        onChange={handleChange}
                    />
                    <label>Show [Core] Only</label>
                </div>
                <div className="checkbox-pair">
                    <input
                        type="checkbox"
                        id="meb_featFilters_monster"
                        onChange={handleChange}
                        disabled={state.featFilters.coreOnly}
                    />
                    <label>Show [Monster] Abilities</label>
                </div>
                <div className="columns num-input">
                    <label>Available at Level: (0 to disable)</label>
                    <input
                        type="number"
                        id="meb_featFilters_levelCap"
                        onChange={handleChange}
                        className="short"
                    />
                </div>
                <div className="checkbox-pair">
                    <input
                        type="checkbox"
                        id="meb_featFilters_levelExact"
                        onChange={handleChange}
                    />
                    <label>Available at <em>exactly</em> above level</label>
                </div>
                <div>
                    <select
                        id="meb_featFilters_tagFilter"
                        onChange={tagSelect}
                    >
                        <option value={false}>Select Tag</option>
                        {gc.feat_tags.map((tagName) => (
                            <option key={tagName} value={tagName}>{tagName}</option>
                        ))}
                    </select>
                </div>
            </div>
        </section>
    );
}

export default FeatsLibraryMenu;