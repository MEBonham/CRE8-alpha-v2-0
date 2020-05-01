import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import fb from '../../fbConfig';

const TalentsLibraryMenu = () => {

    const [allTalents, setAllTalents] = useState([]);
    useEffect(() => {
        const loadFromDb = async () => {
            const allTalentsCopy = [];
            try {
                const query = await fb.db.collection("talents").get();
                query.forEach(doc => {
                    allTalentsCopy.push({
                        slug: doc.id,
                        name: doc.data().name
                    });
                });
                setAllTalents(allTalentsCopy);
            } catch(err) {
                console.log("Database error:", err);
            }
        }
        loadFromDb();
    }, [])

    return (
        <section className="links rows">
            <h2>Talents</h2>
            {allTalents.map((talentObj) => (
                <Link to={`talents/${talentObj.slug}`} key={talentObj.slug}>{talentObj.name}</Link>
            ))}
        </section>
    );
}

export default TalentsLibraryMenu;