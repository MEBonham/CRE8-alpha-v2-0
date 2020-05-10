import React, { useState, useEffect, useRef, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import MyButton from '../ui/MyButton';

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
        if (_isMounted.current) {
            setAllItems(allItemsCopy);
        }
    }
    useEffect(() => {
        loadItems();
    }, [])

    const [selectItems, setSelectItems] = useState({});
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
        setCurrentItem({
            id: ev.target.value,
            ...selectItems[ev.target.value]
        });
    }

    const dispatchRollData = (data) => {
        dispatch({ type: "ROLL_PENDING", payload: data });
    }
    const dispatchGain = () => {
        const itemCopy = { ...currentItem };
        dispatch({ type: "CHAR_EDIT", field: "addItem", payload: itemCopy });
        setCurrentItem(false);
        document.querySelector('.acquiring-center select').value = false;
    }
    const buyItem = (ev) => {
        if (currentItem && state.cur) {
            dispatchRollData({
                ...state.constructRollData(),
                name: "Buy Item",
                merchant: false,
                prevWealth: state.cur.stats.wealth,
                adjustMoneyQty: (0 - currentItem.price),
                type: "wealth roll"
            });
            dispatchGain();
        }
    }
    const gainItem = (ev) => {
        if (currentItem && state.cur) {
            dispatchGain();
        }
    }

    return (
        <section className="acquiring-center columns">
            <select onChange={selectItem} defaultValue={false}>
                <option value={false}>Select Item</option>
                {Object.keys(selectItems).sort().map((itemSlug) => (
                    <option key={itemSlug} value={itemSlug} className="non-false">{selectItems[itemSlug].name}</option>
                ))}
            </select>
            <MyButton fct={buyItem}>Buy</MyButton>
            <MyButton fct={gainItem}>Just Acquire</MyButton>
        </section>
    );
}

export default PlayAcquiringCenter;