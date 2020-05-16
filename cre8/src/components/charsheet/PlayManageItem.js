import React, { useContext } from 'react';

import { Store } from '../GlobalWrapper';
import MyButton from '../ui/MyButton';

const PlayManageItem = ({ item, index, flattened }) => {
    const [state, dispatch] = useContext(Store);
    // console.log(item.name, item.current_index, item.out_of);

    const dispatchRollData = (data) => {
        dispatch({ type: "ROLL_PENDING", payload: data });
    }
    const dispatchLose = () => {
        dispatch({ type: "CHAR_EDIT", field: "loseItem", flattened, payload: index });
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
    const moveUp = (ev) => {
        dispatch({ type: "CHAR_EDIT", field: "swapInventorySpots", flattened, payload: [index - 1, index] });
    }
    const moveDown = (ev) => {
        dispatch({ type: "CHAR_EDIT", field: "swapInventorySpots", flattened, payload: [index, index + 1] });
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
                {item.current_index !== 0 ? <MyButton fct={moveUp}>Move Up</MyButton> : null}
                {item.current_index + 1 < item.out_of ? <MyButton fct={moveDown}>Move Down</MyButton> : null}
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
        </>
    );
}

export default PlayManageItem;