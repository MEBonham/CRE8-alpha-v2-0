import React, { useState, useEffect, useRef, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';

const PlayAcquiringCenter = (props) => {
    const [state, dispatch] = useContext(Store);

    // Protect against memory leak
    const _isMounted = useRef(false);
    useEffect(() => {
        _isMounted.current = true;
        return(() => {
            _isMounted.current = false;
        });
    }, [])

    const [allItems, setAllItems] = useState({});
    const [selectItems, setSelectItems] = useState({});
    const loadItems = async () => {
        const allItemsCopy = {};
        try {
            const query = await fb.db.collection("items").get();
            query.forEach((doc) => {
                allItemsCopy[doc.id] = doc.data();
            });
        } catch(err) {
            console.log("Error:", err);
        }
        if (_isMounted) {
            setAllItems(allItemsCopy);
        }
    }
    useEffect(() => {
        loadItems();
    }, [])
    useEffect(() => {
        const selectItemsCopy = {};
        Object.keys(allItems).forEach((itemSlug) => {
            const itemData = allItems[itemSlug];
            let skip = false;
            if (props.tagFilter && !itemData.tags.includes(props.tagFilter)) skip = true;
            if (!skip) {
                selectItemsCopy[itemSlug] = itemData;
            }
        });
        setSelectItems(selectItemsCopy);
    }, [allItems, props])

    const [currentItem, setCurrentItem] = useState(false);
    const selectItem = (ev) => {
        console.log(selectItems[ev.target.value]);
        setCurrentItem(selectItems[ev.target.value]);
    }

    return (
        <section className="acquiring-center columns">
            <select onChange={selectItem} defaultValue={false}>
                <option value={false}>Select Item</option>
                {Object.keys(selectItems).sort().map((itemSlug) => (
                    <option key={itemSlug} value={itemSlug} className="non-false">{selectItems[itemSlug].name}</option>
                ))}
            </select>

        </section>
    );
}

export default PlayAcquiringCenter;