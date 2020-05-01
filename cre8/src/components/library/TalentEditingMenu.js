import React, { useState, useEffect } from 'react';

import fb from '../../fbConfig';
import MyLink from '../ui/MyLink';

const TalentEditingMenu = () => {
    const [talentSlugsArr, setTalentSlugsArr] = useState([]);
    const [talentNamesArr, setTalentNamesArr] = useState([]);
    const loadAllTalentSlugs = async () => {
        const slugArrCopy = [];
        const nameArrCopy = [];
        try {
            const query = await fb.db.collection("talents").get();
            query.forEach((talent) => {
                slugArrCopy.push(talent.id);
                nameArrCopy.push(talent.data().name);
            })
            setTalentSlugsArr(slugArrCopy);
            setTalentNamesArr(nameArrCopy);
        } catch(err) {
            console.log("Error:", err);
        }
    }
    useEffect(() => {
        loadAllTalentSlugs();
    }, [])

    return (
        <div className="primary-content content-padding">
            {talentSlugsArr.map((slug, i) => (
                <MyLink key={slug} to={`/library/edit/talents/${slug}`}>{talentNamesArr[i]}</MyLink>
            ))}
        </div>
    );
}

export default TalentEditingMenu;