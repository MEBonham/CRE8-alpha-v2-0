import React, { useContext } from 'react';

import { Store } from '../GlobalWrapper';
import Form from '../miniFormik/Form';
import Field from '../miniFormik/Field';
import MyFormButton from '../ui/MyFormButton';
import MyButton from '../ui/MyButton';

const PlayManageItem = ({ item, index, flattened }) => {
    const [state, dispatch] = useContext(Store);

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
        </>
    );
}

export default PlayManageItem;