import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import gc from '../../helpers/GameConstants';

const KitsLibraryMenu = () => {
    const [state, dispatch] = useContext(Store);

    // Protect against memory leak
    const _isMounted = useRef(false);
    useEffect(() => {
        _isMounted.current = true;
        return(() => {
            _isMounted.current = false;
        });
    }, [])

    const [allKits, setAllKits] = useState([]);
    useEffect(() => {
        const loadFromDb = async () => {
            const allKitsCopy = [];
            try {
                const query = await fb.db.collection("kits").get();
                query.forEach(doc => {
                    allKitsCopy.push({
                        slug: doc.id,
                        name: doc.data().name,
                        tags: doc.data().tags,
                        intended_level: doc.data().intended_level
                    });
                });
                if (_isMounted.current) {
                    setAllKits(allKitsCopy);
                }
            } catch(err) {
                console.log("Database error:", err);
            }
        }
        loadFromDb();
    }, [])
    
    const [selectKits, setSelectKits] = useState([]);
    useEffect(() => {
        const selectKitsCopy = [];
        allKits.forEach((kitObj) => {
            let skip = false;
            if (!state.kitFilters.monster && kitObj.tags.includes("Monster")) skip = true;
            if (state.kitFilters.levelCap && (kitObj.intended_level > state.kitFilters.levelCap)) skip = true;
            if (state.kitFilters.levelCap && state.kitFilters.levelExact && (kitObj.intended_level !== state.kitFilters.levelCap)) skip = true;
            if (state.kitFilters.coreOnly && !kitObj.tags.includes("Core")) skip = true;
            if (state.kitFilters.tagFilter && !kitObj.tags.includes(state.kitFilters.tagFilter)) skip = true;
            if (!skip) {
                selectKitsCopy.push({
                    ...kitObj
                });
            }
        });
        setSelectKits(
            selectKitsCopy.sort((a, b) => {
                if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
                if (a.name.toUpperCase() > b.name.toUpperCase()) return 1;
                return 0;
            })
        );
    }, [allKits, state.kitFilters])
    
    useEffect(() => {
        Object.keys(state.kitFilters).forEach((property) => {
            const el = document.getElementById(`meb_kitFilters_${property}`);
            if (el.type === "checkbox") {
                el.checked = state.kitFilters[property];
            } else {
                el.value = state.kitFilters[property];
            }
        });
    }, [state.kitFilters])

    useEffect(() => {
        if (selectKits) {
            dispatch({ type: "SET", key: "kitCycleLinks", payload:
                selectKits });
        }
    }, [selectKits, dispatch])

    const handleChange = (ev) => {
        let value = (ev.target.type === "checkbox") ? ev.target.checked : ev.target.value;
        const property = ev.target.id.split("_")[2];
        if (property === "levelCap") {
            value = parseInt(value);
        }
        dispatch({ type: "SET", key: "kitFilters", payload: {
            ...state.kitFilters,
            [property]: value
        } });
    }
    const tagSelect = (ev) => {
        dispatch({ type: "SET", key: "kitFilters", payload: {
            ...state.kitFilters,
            tagFilter: ev.target.value
        } });
    }
    
    return (
        <section className="links columns space-between">
            <div className="rows">
                <h2>Kits</h2>
                {selectKits.map((kitObj) => (
                    <Link to={`kits/${kitObj.slug}`} key={kitObj.slug}>{kitObj.name}</Link>
                ))}
            </div>
            <div className="filters rows">
                <div className="checkbox-pair">
                    <input
                        type="checkbox"
                        id="meb_kitFilters_coreOnly"
                        onChange={handleChange}
                    />
                    <label>Show [Core] Only</label>
                </div>
                <div className="checkbox-pair">
                    <input
                        type="checkbox"
                        id="meb_kitFilters_monster"
                        onChange={handleChange}
                        disabled={state.kitFilters.coreOnly}
                    />
                    <label>Show [Monster] Abilities</label>
                </div>
                <div className="columns num-input">
                    <label>Available at Level: (0 to disable)</label>
                    <input
                        type="number"
                        id="meb_kitFilters_levelCap"
                        onChange={handleChange}
                        className="short"
                    />
                </div>
                <div className="checkbox-pair">
                    <input
                        type="checkbox"
                        id="meb_kitFilters_levelExact"
                        onChange={handleChange}
                    />
                    <label>Available at <em>exactly</em> above level</label>
                </div>
                <div>
                    <select
                        id="meb_kitFilters_tagFilter"
                        onChange={tagSelect}
                    >
                        <option value={false}>Select Tag</option>
                        {gc.kit_tags.map((tagName) => (
                            <option key={tagName} value={tagName}>{tagName}</option>
                        ))}
                    </select>
                </div>
            </div>
        </section>
    );
}

export default KitsLibraryMenu;