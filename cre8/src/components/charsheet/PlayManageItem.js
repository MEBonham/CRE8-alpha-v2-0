import React, { useContext } from 'react';

import { Store } from '../GlobalWrapper';
import MyButton from '../ui/MyButton';

const PlayManageItem = ({ item, index }) => {
    const [state, dispatch] = useContext(Store);

    const dispatchRollData = (data) => {
        dispatch({ type: "ROLL_PENDING", payload: data });
    }
    const dispatchLose = () => {
        dispatch({ type: "CHAR_EDIT", field: "loseItem", payload: item.id });
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

    const moveUp = (ev) => {
        dispatch({ type: "CHAR_EDIT", field: "swapInventorySpots", payload: [index - 1, index] });
    }
    const moveDown = (ev) => {
        dispatch({ type: "CHAR_EDIT", field: "swapInventorySpots", payload: [index, index + 1] });
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
                {index !== 0 ? <MyButton fct={moveUp}>Move Up</MyButton> : null}
                {state.cur && index + 1 < state.cur.stats.inventory.length ? <MyButton fct={moveDown}>Move Down</MyButton> : null}
            </div>
            <p>{item.description}</p>
        </>
    );
}

export default PlayManageItem;