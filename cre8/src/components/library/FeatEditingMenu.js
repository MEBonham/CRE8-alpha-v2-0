import React, { useState, useEffect } from 'react';

import fb from '../../fbConfig';
import MyLink from '../ui/MyLink';

const FeatEditingMenu = () => {
    const [featSlugsArr, setFeatSlugsArr] = useState([]);
    const [featNamesArr, setFeatNamesArr] = useState([]);
    const loadAllFeatSlugs = async () => {
        const slugArrCopy = [];
        const nameArrCopy = [];
        try {
            const query = await fb.db.collection("feats").get();
            query.forEach((feat) => {
                slugArrCopy.push(feat.id);
                nameArrCopy.push(feat.data().name);
            })
            setFeatSlugsArr(slugArrCopy);
            setFeatNamesArr(nameArrCopy);
        } catch(err) {
            console.log("Error:", err);
        }
    }
    useEffect(() => {
        loadAllFeatSlugs();
    }, [])

    return (
        <div className="primary-content content-padding">
            {featSlugsArr.map((slug, i) => (
                <MyLink key={slug} to={`/library/edit/feats/${slug}`}>{featNamesArr[i]}</MyLink>
            ))}
        </div>
    );
}

export default FeatEditingMenu;