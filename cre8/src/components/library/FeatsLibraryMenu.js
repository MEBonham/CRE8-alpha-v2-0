import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';

const FeatsLibraryMenu = () => {
    const [, dispatch] = useContext(Store);

    const [allFeats, setAllFeats] = useState([]);
    useEffect(() => {
        const loadFromDb = async () => {
            const allFeatsCopy = [];
            try {
                const query = await fb.db.collection("feats").get();
                query.forEach(doc => {
                    allFeatsCopy.push({
                        slug: doc.id,
                        name: doc.data().name
                    });
                });
                setAllFeats(allFeatsCopy);
            } catch(err) {
                console.log("Database error:", err);
            }
        }
        loadFromDb();
    }, [])

    useEffect(() => {
        if (allFeats) {
            dispatch({ type: "SET", key: "featCycleLinks", payload:
                allFeats.sort((a, b) => { return (a.name.toUpperCase() - b.name.toUpperCase())}) });
        }
    }, [allFeats, dispatch])

    return (
        <section className="links rows">
            <h2>Feats</h2>
            {allFeats.map((featObj) => (
                <Link to={`feats/${featObj.slug}`} key={featObj.slug}>{featObj.name}</Link>
            ))}
        </section>
    );
}

export default FeatsLibraryMenu;