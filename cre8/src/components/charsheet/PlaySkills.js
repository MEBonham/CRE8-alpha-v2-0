import React, { useContext } from 'react';

import { Store } from '../GlobalWrapper';
import gc from '../../helpers/GameConstants';
import MyButton from '../ui/MyButton';
import { ifPlus } from '../../helpers/Calculations';
import d20Icon from '../../media/d20-icon.png';

const PlaySkills = () => {
    const [state, dispatch] = useContext(Store);

    const dispatchRollData = (data) => {
        dispatch({ type: "ROLL_PENDING", payload: data, elementToReset: document.getElementById("meb_select_d20dieMode") });
    }
    const skillRoll = (ev) => {
        if (state.cur) {
            dispatchRollData({
                ...state.constructRollData(),
                dieMode: state.dieRollMode,
                name: ev.target.id.split("_")[2].split("-").join(" "),
                dieModBasic: parseInt(ev.target.id.split("_")[3]),
                type: "skill check",
                coasting: state.cur.coasting ? state.cur.stats.coast_number : 0
            });
        }
    }

    return (
        <section className="skill-rolls rows">
            <h2>Skills</h2>
            <div className="rows">
                {gc.skills_list.map((skill) => (
                    <MyButton fct={skillRoll} evData={`meb_roll_${skill}-Check_${state.cur.stats.skill_mods_net[skill]}`} key={skill}>
                        <img src={d20Icon} alt="" />
                        {skill} Check ({ifPlus(state.cur.stats.skill_mods_net[skill]) + state.cur.stats.skill_mods_net[skill]})
                    </MyButton>
                ))}
            </div>
        </section>
    );
}

export default PlaySkills;
