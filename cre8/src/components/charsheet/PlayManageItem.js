import React, { useState, useEffect, useRef, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import Form from '../miniFormik/Form';
import Field from '../miniFormik/Field';
import MyFormButton from '../ui/MyFormButton';
import MyButton from '../ui/MyButton';

const PlayManageItem = ({ item, index, flattened }) => {
    const [state, dispatch] = useContext(Store);

    // Protect against memory leak
    const _isMounted = useRef(false);
    useEffect(() => {
        _isMounted.current = true;
        return(() => {
            _isMounted.current = false;
        });
    }, [])

    const dispatchRollData = (data) => {
        dispatch({ type: "ROLL_PENDING", payload: data });
    }
    const dispatchLose = () => {
        dispatch({ type: "CHAR_EDIT", field: "loseItem", flattened, index });
    }
    const sellItem = (ev) => {
        if (state.cur) {
            const merchant = ev.target.id.split("_")[2] === "merchant" ? true : false;
            dispatchRollData({
                ...state.constructRollData(),
                name: "Sell Item",
                merchant,
                haggle: state.cur.stats.traits_from_talents.includes("Haggler"),
                prevWealth: state.cur.stats.wealth,
                adjustMoneyQty: parseInt(item.price),
                type: "wealth roll"
            });
            dispatchLose();
        }
    }
    const loseItem = (ev) => {
        dispatchLose();
    }

    const moveItem = (ev) => {
        dispatch({ type: "CHAR_EDIT", field: "moveItemInInventory", newLocation: ev.target.value, payload: item });
    }

    const updateCustomItem = (ev, formData) => {
        dispatch({ type: "CHAR_EDIT", field: "updateCustomItem", flattened, index, payload: {
            ...item,
            ...formData
        } });
    }
    const addRitual = (ev, formData) => {
        const included_rituals = formData.new_ritual_id ? 
            [ ...item.included_rituals, formData.new_ritual_id ] :
            [ ...item.included_rituals ];
        dispatch({ type: "CHAR_EDIT", field: "updateCustomItem", flattened, index, payload: {
            ...item,
            price: formData.price,
            included_rituals
        } });
    }

    const [allRituals, setAllRituals] = useState({});
    const [selectRituals, setSelectRituals] = useState({});
    const loadRituals = async () => {
        const allRitualsCopy = {};
        try {
            const query = await fb.db.collection("rituals").get();
            query.forEach((doc) => {
                allRitualsCopy[doc.id] = doc.data();
            });
        } catch(err) {
            console.log("Error:", err);
        }
        if (_isMounted.current) {
            setAllRituals(allRitualsCopy);
        }
    }
    useEffect(() => {
        loadRituals();
    }, [])
    useEffect(() => {
        const selectRitualsCopy = {};
        Object.keys(allRituals).forEach((ritualSlug) => {
            const ritualData = allRituals[ritualSlug];
            let skip = false;
            // if (!props.search.monster && ritualData.tags.includes("Monster")) skip = true;
            // if (props.search.level_access && (ritualData.intended_level - props.level > 1)) skip = true;
            if (!skip) {
                selectRitualsCopy[ritualSlug] = ritualData;
            }
        });
        setSelectRituals(selectRitualsCopy);
    }, [allRituals])
    const previewRitual = (ev) => {
        const ritual_id = ev.target.id.split("_")[2];
        const payload = {
            type: "rituals",
            data: {
                ...selectRituals[ritual_id],
                id: ritual_id
            }
        };
        dispatch({ type: "SET", key: "preview", payload });
    }

    return (
        <>
            <div className="float-right">
                {state.cur && state.cur.stats.traits_from_talents.includes("Merchant") ?
                    <MyButton fct={sellItem} evData={`meb_sellButton_merchant`}>Sell as Merchant</MyButton> :
                null}
                <MyButton fct={sellItem} evData={`meb_sellButton_normal`}>Sell Item</MyButton>
                <MyButton fct={loseItem}>Use Up or Lose Item</MyButton>
            </div>
            <div className="float-right">
                <label>Item Location:</label>
                <select onChange={moveItem} defaultValue={item.location}>
                    <option value="Readily Available">Readily Available</option>
                    <option value="Worn/Wielded">Worn/Wielded</option>
                    <option value="Not Carried">Not Carried</option>
                    {state.cur ?
                        state.cur.stats.inventory.filter((itemObj) => itemObj.tags.includes("Container")).map((itemObj, i) => (
                            <option key={i} value={itemObj.id}>{itemObj.name}</option>
                        )) :
                    null}
                </select>
            </div>
            <p>{item.description}</p>
            {item.tags.includes("Custom") ? 
                <Form
                    onSubmit={updateCustomItem}
                    defaultValues={{
                        name: item.name,
                        description: item.description,
                        bulk: item.bulk,
                        price: item.price
                    }}
                    reset={false}
                    className="update-custom-item"
                >
                    <div className="rows">
                        <div className="rows">
                            <label htmlFor="name">Name</label>
                            <Field name="name" type="text" required />
                        </div>
                        <div className="columns">
                            <div className="rows">
                                <label htmlFor="price">Price</label>
                                <Field name="price" type="number" className="medium" />
                            </div>
                            <div className="rows">
                                <label htmlFor="bulk">Bulk</label>
                                <Field name="bulk" type="number" className="medium" />
                            </div>
                        </div>
                        <div className="rows">
                            <label htmlFor="description">Description</label>
                            <Field name="description" as="textarea" rows="4" cols="50" />
                        </div>
                    </div>
                    <MyFormButton type="submit">Save</MyFormButton>
                </Form> :
            null}
            {item.has_rituals ? 
                <div className="manage-item-rituals">
                    <h3>Rituals</h3>
                    <p>
                        {item.included_rituals.map((ritual_id, i) => (
                            <span key={i}>
                                <span
                                    onClick={previewRitual}
                                    id={`meb_prevRitual_${ritual_id}`}
                                    className="preview-link"
                                >
                                    {(selectRituals && selectRituals[ritual_id]) ? selectRituals[ritual_id].name : null}
                                </span>{(i < item.included_rituals.length - 1) ? ", " : ""}
                            </span>
                        ))}
                    </p>
                    <Form
                        onSubmit={addRitual}
                        defaultValues={{
                            price: item.price
                        }}
                        reset={false}
                        className="update-custom-item"
                    >
                        <div className="rows">
                            <label htmlFor="price">Price</label>
                            <Field name="price" type="number" className="medium" />
                        </div>
                        <Field as="select" name="new_ritual_id">
                            <option value={false}>Select Ritual</option>
                            {Object.keys(selectRituals).map((ritual_id) => (
                                <option key={ritual_id} value={ritual_id}>{selectRituals[ritual_id].name}</option>
                            ))}
                        </Field>
                        <MyFormButton type="submit">Save</MyFormButton>
                    </Form>
                </div> :
            null}
        </>
    );
}

export default PlayManageItem;