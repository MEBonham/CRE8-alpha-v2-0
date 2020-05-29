import React, { useContext } from 'react';

import { Store } from '../GlobalWrapper';
import gc from '../../helpers/GameConstants';
import MyButton from '../ui/MyButton';
import { ifPlus } from '../../helpers/Calculations';
import d20Icon from '../../media/d20-icon.png';

const PlayGeneralRolls = () => {
    const [state, dispatch] = useContext(Store);

    const dispatchRollData = (data) => {
        dispatch({ type: "ROLL_PENDING", payload: data, elementToReset: document.getElementById("meb_select_d20dieMode") });
        // dispatch({ type: "ROLL_PENDING", payload: data });
    }
    const generalRoll = (ev) => {
        if (state.cur) {
            dispatchRollData({
                ...state.constructRollData(),
                dieMode: state.dieRollMode,
                name: ev.target.id.split("_")[2].split("-").join(" "),
                dieModBasic: parseInt(ev.target.id.split("_")[3]),
                type: "general roll"
            });
            // document.getElementById("meb_select_d20dieMode").value = "normal";
        }
    }
    const savingRoll = (ev) => {
        if (state.cur) {
            const specialMod = {};
            if (state.cur.stats.active_conditions.includes("Wounded") && !state.cur.stats.traits_from_kits.includes("Wound-Tolerant")) {
                specialMod.wounded = {
                    wounded: {
                        num: gc.wounded_save_penalty
                    }
                };
            }
            dispatchRollData({
                ...state.constructRollData(),
                dieMode: state.dieRollMode,
                name: ev.target.id.split("_")[2].split("-").join(" "),
                dieModBasic: parseInt(ev.target.id.split("_")[3]),
                dieModsMisc: {
                    ...state.constructRollData().dieModsMisc,
                    ...specialMod
                },
                type: "saving throw"
            });
            // document.getElementById("meb_select_d20dieMode").value = "normal";
        }
    }

    return (
        <section className="general-rolls columns">
            <div className="general-general rows">
                <div className="av-display">Armor Value: {state.cur.stats.armor_value}</div>
                <MyButton fct={generalRoll} evData={`meb_roll_Heroics-Check_${state.cur.stats.heroic_bonus}`}>
                    <img src={d20Icon} alt="" />
                    Heroics Check ({ifPlus(state.cur.stats.heroic_bonus) + state.cur.stats.heroic_bonus})
                </MyButton>
                <MyButton fct={generalRoll} evData={`meb_roll_Awesome-Check_${state.cur.stats.awesome_check}`}>
                    <img src={d20Icon} alt="" />
                    Awesome Check ({ifPlus(state.cur.stats.awesome_check) + state.cur.stats.awesome_check})
                </MyButton>
                <MyButton fct={generalRoll} evData={`meb_roll_Spellcraft-Check_${state.cur.stats.spellcraft_check}`}>
                    <img src={d20Icon} alt="" />
                    Spellcraft Check ({ifPlus(state.cur.stats.spellcraft_check) + state.cur.stats.spellcraft_check})
                </MyButton>
                <MyButton fct={generalRoll} evData={`meb_roll_Speed-Check_${state.cur.stats.speed}`}>
                    <img src={d20Icon} alt="" />
                    Speed Check ({ifPlus(state.cur.stats.speed) + state.cur.stats.speed})
                </MyButton>
            </div>
            <div className="saving-throws rows">
                <div className="av-display">Resistance Value: {state.cur.stats.resistance_value}</div>
                <MyButton fct={savingRoll} evData={`meb_roll_Defense-Save_${state.cur.stats.defense_total}`}>
                    <img src={d20Icon} alt="" />
                    Defense Save ({ifPlus(state.cur.stats.defense_total) + state.cur.stats.defense_total})
                </MyButton>
                <MyButton fct={savingRoll} evData={`meb_roll_Fortitude-Save_${state.cur.stats.fortitude_total}`}>
                    <img src={d20Icon} alt="" />
                    Fortitude Save ({ifPlus(state.cur.stats.fortitude_total) + state.cur.stats.fortitude_total})
                </MyButton>
                <MyButton fct={savingRoll} evData={`meb_roll_Reflex-Save_${state.cur.stats.reflex_total}`}>
                    <img src={d20Icon} alt="" />
                    Reflex Save ({ifPlus(state.cur.stats.reflex_total) + state.cur.stats.reflex_total})
                </MyButton>
                <MyButton fct={savingRoll} evData={`meb_roll_Willpower-Save_${state.cur.stats.willpower_total}`}>
                    <img src={d20Icon} alt="" />
                    Willpower Save ({ifPlus(state.cur.stats.willpower_total) + state.cur.stats.willpower_total})
                </MyButton>
            </div>
        </section>
    );
}

export default PlayGeneralRolls;