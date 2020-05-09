import React, { useEffect, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import MyButton from '../ui/MyButton';
import useLsPersistedState from '../../hooks/useLsPersistedState';
import { rollDefault } from '../../helpers/Templates';
import PlayAcquiringCenter from './PlayAcquiringCenter';

const PlayEquipment = () => {
    const [state, dispatch] = useContext(Store);
    const LS_KEY = "moneyGainLose";

    const [moneyQtyField, setMoneyQtyField] = useLsPersistedState(LS_KEY, 0);
    const adjustMoneyQty = (ev) => {
        setMoneyQtyField(ev.target.value);
    }

    const constructRollData = () => {
        const userStamp = state.user ? state.user.uid : "anon";
        return {
            ...rollDefault,
            id: `${Date.now()}-${userStamp}`,
            character: state.cur.name,
            campaigns: state.cur.campaigns,
            dieMode: false
        };
    }
    const dispatchRollData = (data) => {
        dispatch({ type: "ROLL_PENDING", payload: data });
    }
    const gainMoney = (ev) => {
        if (state.cur && parseInt(moneyQtyField) !== 0) {
            const moneyQtyCopy = parseInt(moneyQtyField);
            setMoneyQtyField(0);
            dispatchRollData({
                ...constructRollData(),
                name: "Gain/Lose Money",
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
                ...constructRollData(),
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
            <PlayAcquiringCenter />
        </section>
    );
}

export default PlayEquipment;