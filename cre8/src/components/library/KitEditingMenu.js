import React, { useState, useEffect } from 'react';

import fb from '../../fbConfig';
import MyLink from '../ui/MyLink';

const KitEditingMenu = () => {
    const [kitSlugsArr, setKitSlugsArr] = useState([]);
    const [kitNamesArr, setKitNamesArr] = useState([]);
    const loadAllKitSlugs = async () => {
        const slugArrCopy = [];
        const nameArrCopy = [];
        try {
            const query = await fb.db.collection("kits").get();
            query.forEach((kit) => {
                slugArrCopy.push(kit.id);
                nameArrCopy.push(kit.data().name);
            })
            setKitSlugsArr(slugArrCopy);
            setKitNamesArr(nameArrCopy);
        } catch(err) {
            console.log("Error:", err);
        }
    }
    useEffect(() => {
        loadAllKitSlugs();
    }, [])

    return (
        <div className="primary-content content-padding">
            {kitSlugsArr.map((slug, i) => (
                <MyLink key={slug} to={`/library/edit/kits/${slug}`}>{kitNamesArr[i]}</MyLink>
            ))}
        </div>
    );
}

export default KitEditingMenu;