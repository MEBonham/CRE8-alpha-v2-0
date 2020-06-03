import React, { useState, useEffect } from 'react';

import fb from '../../fbConfig';
import MyLink from '../ui/MyLink';

const RitualEditingMenu = () => {
    const [ritualSlugsArr, setRitualSlugsArr] = useState([]);
    const [ritualNamesArr, setRitualNamesArr] = useState([]);
    const loadAllRitualSlugs = async () => {
        const slugArrCopy = [];
        const nameArrCopy = [];
        try {
            const query = await fb.db.collection("rituals").get();
            query.forEach((ritual) => {
                slugArrCopy.push(ritual.id);
                nameArrCopy.push(ritual.data().name);
            })
            setRitualSlugsArr(slugArrCopy);
            setRitualNamesArr(nameArrCopy);
        } catch(err) {
            console.log("Error:", err);
        }
    }
    useEffect(() => {
        loadAllRitualSlugs();
    }, [])

    return (
        <div className="primary-content content-padding">
            {ritualSlugsArr.map((slug, i) => (
                <MyLink key={slug} to={`/library/edit/rituals/${slug}`}>{ritualNamesArr[i]}</MyLink>
            ))}
        </div>
    );
}

export default RitualEditingMenu;