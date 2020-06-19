import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import gc from '../../helpers/GameConstants';

const RitualsLibraryMenu = () => {
    const [state, dispatch] = useContext(Store);

    // Protect against memory leak
    const _isMounted = useRef(false);
    useEffect(() => {
        _isMounted.current = true;
        return(() => {
            _isMounted.current = false;
        });
    }, [])

    const [allRituals, setAllRituals] = useState([]);
    useEffect(() => {
        const loadFromDb = async () => {
            const allRitualsCopy = [];
            try {
                const query = await fb.db.collection("rituals").get();
                query.forEach(doc => {
                    allRitualsCopy.push({
                        slug: doc.id,
                        name: doc.data().name,
                        tags: doc.data().tags
                    });
                });
                if (_isMounted.current) {
                    setAllRituals(allRitualsCopy);
                }
            } catch(err) {
                console.log("Database error:", err);
            }
        }
        loadFromDb();
    }, [])
    
    const [selectRituals, setSelectRituals] = useState([]);
    useEffect(() => {
        const selectRitualsCopy = [];
        allRituals.forEach((ritualObj) => {
            let skip = false;
            if (state.ritualFilters.tagFilter && !ritualObj.tags.includes(state.ritualFilters.tagFilter)) skip = true;
            if (!skip) {
                selectRitualsCopy.push({
                    ...ritualObj
                });
            }
        });
        setSelectRituals(
            selectRitualsCopy.sort((a, b) => {
                if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
                if (a.name.toUpperCase() > b.name.toUpperCase()) return 1;
                return 0;
            })
        );
    }, [allRituals, state.ritualFilters])
    
    useEffect(() => {
        Object.keys(state.ritualFilters).forEach((property) => {
            const el = document.getElementById(`meb_ritualFilters_${property}`);
            if (el.type === "checkbox") {
                el.checked = state.ritualFilters[property];
            } else {
                el.value = state.ritualFilters[property];
            }
        });
    }, [state.ritualFilters])

    useEffect(() => {
        if (selectRituals) {
            dispatch({ type: "SET", key: "ritualCycleLinks", payload:
                selectRituals });
        }
    }, [selectRituals, dispatch])
    
    const tagSelect = (ev) => {
        const value = (ev.target.value === "false") ? false : ev.target.value;
        dispatch({ type: "SET", key: "ritualFilters", payload: {
            ...state.ritualFilters,
            tagFilter: value
        } });
    }
    
    return (
        <section className="links columns space-between">
            <div className="rows">
                <h2>Rituals</h2>
                {selectRituals.map((ritualObj) => (
                    <Link to={`rituals/${ritualObj.slug}`} key={ritualObj.slug}>{ritualObj.name}</Link>
                ))}
            </div>
            <div>
                <div>
                    <select
                        id="meb_ritualFilters_tagFilter"
                        onChange={tagSelect}
                    >
                        <option value={false}>Select Tag</option>
                        {gc.ritual_tags.map((tagName) => (
                            <option key={tagName} value={tagName}>{tagName}</option>
                        ))}
                    </select>
                </div>
            </div>
        </section>
    );
}

export default RitualsLibraryMenu;