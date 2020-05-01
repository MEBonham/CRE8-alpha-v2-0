import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import fb from '../../fbConfig';

const KitsLibraryMenu = () => {

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