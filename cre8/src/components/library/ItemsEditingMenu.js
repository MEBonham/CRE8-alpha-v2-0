import React, { useState, useEffect } from 'react';

import fb from '../../fbConfig';
import MyLink from '../ui/MyLink';

const ItemEditingMenu = () => {
    const [itemSlugsArr, setItemSlugsArr] = useState([]);
    const [itemNamesArr, setItemNamesArr] = useState([]);
    const loadAllItemSlugs = async () => {
        const slugArrCopy = [];
        const nameArrCopy = [];
        try {
            const query = await fb.db.collection("items").get();
            query.forEach((item) => {
                slugArrCopy.push(item.id);
                nameArrCopy.push(item.data().name);
            })
            setItemSlugsArr(slugArrCopy);
            setItemNamesArr(nameArrCopy);
        } catch(err) {
            console.log("Error:", err);
        }
    }
    useEffect(() => {
        loadAllItemSlugs();
    }, [])

    return (
        <div className="primary-content content-padding">
            {itemSlugsArr.map((slug, i) => (
                <MyLink key={slug} to={`/library/edit/items/${slug}`}>{itemNamesArr[i]}</MyLink>
            ))}
        </div>
    );
}

export default ItemEditingMenu;