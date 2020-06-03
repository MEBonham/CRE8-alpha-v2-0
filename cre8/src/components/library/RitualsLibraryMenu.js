import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';

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
            if (!state.ritualFilters.monster && ritualObj.tags.includes("Monster")) skip = true;
            if (state.ritualFilters.levelCap && (ritualObj.intended_level > state.ritualFilters.levelCap)) skip = true;
            if (state.ritualFilters.levelCap && state.ritualFilters.levelExact && (ritualObj.intended_level !== state.ritualFilters.levelCap)) skip = true;
            if (state.ritualFilters.coreOnly && !ritualObj.tags.includes("Core")) skip = true;
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
    
    return (
        <section className="links columns space-between">
            <div className="rows">
                <h2>Rituals</h2>
                {selectRituals.map((ritualObj) => (
                    <Link to={`rituals/${ritualObj.slug}`} key={ritualObj.slug}>{ritualObj.name}</Link>
                ))}
            </div>
        </section>
    );
}

export default RitualsLibraryMenu;