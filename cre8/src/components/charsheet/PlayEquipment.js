import React, { useState, useEffect, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import MyButton from '../ui/MyButton';
import useLsPersistedState from '../../hooks/useLsPersistedState';
import PlayAcquiringCenter from './PlayAcquiringCenter';
import Accordion from '../ui/Accordion';
import AccordionSection from '../ui/AccordionSection';
import PlayItemSummary from './PlayItemSummary';
import PlayManageItem from './PlayManageItem';

const PlayEquipment = () => {
    const [state, dispatch] = useContext(Store);
    const LS_KEY = "moneyGainLose";

    const [flattened, setFlattened] = useState([]);
    const [bulkCapacity, setBulkCapacity] = useState(50);
    useEffect(() => {
        let minCapacity = 0;
        if (state.cur.stats.size_final > -4) minCapacity = 1;
        if (state.cur.stats.size_final > -3) minCapacity = 5;
        setBulkCapacity(Math.max(minCapacity, state.cur.stats.skill_mods_net.Brawn * 10 + 50));

        const inventoryCopy = [];
        state.cur.stats.inventory.forEach((itemObj, i) => {
            const heldCopy = [ ...itemObj.held_items ];
            inventoryCopy.push({
                ...itemObj,
                held_items: [],
                contained: false,
                current_index: i,
                out_of: state.cur.stats.inventory.length
            });
            // console.log(itemObj.held_items);
            heldCopy.forEach((heldItemObj, j) => {
                inventoryCopy.push({
                    ...heldItemObj,
                    held_items: [],
                    contained: true,
                    current_index: j,
                    out_of: heldCopy.length
                });
            });
        });
        setFlattened(inventoryCopy);
    }, [state.cur])

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
                    {flattened.map((itemObj, i) => (
                        <AccordionSection key={i}>
                            <PlayItemSummary item={itemObj} flattened={flattened} index={i} />
                            <PlayManageItem item={itemObj} flattened={flattened} index={i} />
                        </AccordionSection>
                    ))}
                </Accordion>
                <h4>
                    <span className="name-qty" />
                    <span className="bulk total">Total Bulk: {state.cur.stats.bulk_carried} (capacity {bulkCapacity})</span>
                </h4>
            </section>
            <PlayAcquiringCenter />
        </section>
    );
}

export default PlayEquipment;