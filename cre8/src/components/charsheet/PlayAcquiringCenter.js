import React, { useState, useEffect, useRef, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import { itemDefault } from '../../helpers/Templates';
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
        if (ev.target.value === "Custom") {
            setCurrentItem({
                ...itemDefault,
                name: "Custom Item",
                tags: [ "Custom" ],
                id: uuidv4()
            });
        } else if (ev.target.value === "Spell Scroll") {
            setCurrentItem({
                ...itemDefault,
                name: "Spell Scroll",
                tags: [ "Consumable", "Custom", "Magical" ],
                price: "0",
                bulk: "1",
                description: "This is a scroll containing instructions to conduct a Ritual, typically rolled up inside a scroll case. Performing the ritual takes the normal amount of Casting Time, but the power of the Ritual's Components has already been bound within the scroll. When the Ritual is completed, the scroll crumbles to dust. The Price of a Spell Scroll is typically the Ritual's Component Cost + the Ritual's Level, and the Bulk of a Spell Scroll is typically the Ritual's Level.",
                id: uuidv4(),
                has_rituals: true
            });
        } else {
            setCurrentItem({
                id: ev.target.value,
                ...selectItems[ev.target.value]
            });
        }
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
                adjustMoneyQty: (0 - parseInt(currentItem.price)),
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
                <option value="Custom">Custom Item</option>
                <option value="Spell Scroll">Spell Scroll</option>
                {Object.keys(selectItems).sort().map((itemSlug) => (
                    <option key={itemSlug} value={itemSlug} className="non-false">({selectItems[itemSlug].price}) {selectItems[itemSlug].name}</option>
                ))}
            </select>
            <MyButton fct={buyItem}>Buy</MyButton>
            <MyButton fct={gainItem}>Just Acquire</MyButton>
        </section>
    );
}

export default PlayAcquiringCenter;