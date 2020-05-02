import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';

const KitsLibraryMenu = () => {
    const [, dispatch] = useContext(Store);

    const [allKits, setAllKits] = useState([]);
    useEffect(() => {
        const loadFromDb = async () => {
            const allKitsCopy = [];
            try {
                const query = await fb.db.collection("kits").get();
                query.forEach(doc => {
                    allKitsCopy.push({
                        slug: doc.id,
                        name: doc.data().name
                    });
                });
                setAllKits(allKitsCopy);
            } catch(err) {
                console.log("Database error:", err);
            }
        }
        loadFromDb();
    }, [])

    useEffect(() => {
        if (allKits) {
            dispatch({ type: "SET", key: "kitCycleLinks", payload: 
                allKits.sort((a, b) => { return (a.name.toUpperCase() - b.name.toUpperCase())}) });
        }
    }, [allKits, dispatch])

    return (
        <section className="links rows">
            <h2>Kits</h2>
            {allKits.map((kitObj) => (
                <Link to={`kits/${kitObj.slug}`} key={kitObj.slug}>{kitObj.name}</Link>
            ))}
        </section>
    );
}

export default KitsLibraryMenu;