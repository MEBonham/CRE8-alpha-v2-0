import React, { useEffect, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import MyButton from '../ui/MyButton';
import useLsPersistedState from '../../hooks/useLsPersistedState';
import PlayAcquiringCenter from './PlayAcquiringCenter';
import Accordion from '../ui/Accordion';
import AccordionSection from '../ui/AccordionSection';

const PlayEquipment = () => {
    const [state, dispatch] = useContext(Store);
    const LS_KEY = "moneyGainLose";

    const [moneyQtyField, setMoneyQtyField] = useLsPersistedState(LS_KEY, 0);
    const adjustMoneyQty = (ev) => {
        setMoneyQtyField(ev.target.value);
    }

    const dispatchRollData = (data) => {
        dispatch({ type: "ROLL_PENDING", payload: data });
    }
    const gainMoney = (ev) => {
        if (state.cur && parseInt(moneyQtyField) !== 0) {
            const moneyQtyCopy = parseInt(moneyQtyField);
            setMoneyQtyField(0);
            dispatchRollData({
                ...state.constructRollData(),
                name: "Gain/Lose Money",
                dieMode: false,
                // merchant: state.cur.stats.traits_from_talents.includes("Merchant"),
                merchant: false,
                prevWealth: state.cur.stats.wealth,
                adjustMoneyQty: moneyQtyCopy,
                type: "wealth roll"
            });
        }
    }
    const loseMoney = (ev) => {
        if (state.cur && parseInt(moneyQtyField) !== 0) {
            const moneyQtyCopy = parseInt(moneyQtyField);
            setMoneyQtyField(0);
            dispatchRollData({
                ...state.constructRollData(),
                name: "Gain/Lose Money",
                merchant: false,
                prevWealth: state.cur.stats.wealth,
                adjustMoneyQty: (0 - moneyQtyCopy),
                type: "wealth roll"
            });
        }
    }

    useEffect(() => {
        document.getElementById("meb_playEquip_moneyGainLose").value = moneyQtyField;
    }, [moneyQtyField])

    return (
        <section className="play-equipment">
            <header className="columns space-between">
                <h2>Equipment</h2>
                <div className="rows">
                    <p className="big-num">{state.cur.stats.wealth}</p>
                    <p className="small">Wealth</p>
                </div>
            </header>
            <div className="float-right columns">
                <MyButton fct={gainMoney}>Gain Money</MyButton>
                <input
                    type="number"
                    name="playEquip_moneyGainLose"
                    id="meb_playEquip_moneyGainLose"
                    onChange={adjustMoneyQty}
                    className="short"
                />
                <MyButton fct={loseMoney}>Lose Money</MyButton>
            </div>
            <section className="inventory-display">
                <Accordion uniqueKey="meb_inventoryDisplay" cur={state.cur.id}>
                    {state.cur.stats.inventory.map((itemObj, i) => (
                        <AccordionSection key={i}>
                            <h4>
                                <span className="name-qty">{itemObj.name}{itemObj.quantity > 1 ? ` (x${itemObj.quantity})` : null}</span>
                                <span className="bulk">Bulk: {itemObj.bulk}</span>
                                <span className="price">Price: {itemObj.price}</span>
                            </h4>
                            <>
                                <p>{itemObj.description}</p>
                            </>
                        </AccordionSection>
                    ))}
                </Accordion>
            </section>
            <PlayAcquiringCenter />
        </section>
    );
}

export default PlayEquipment;