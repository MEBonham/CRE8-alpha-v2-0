import React, { useEffect, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import gc from '../../helpers/GameConstants';

const ConfigureSkills = () => {
    const [state, dispatch] = useContext(Store);

    const trainSkill = (ev) => {
        dispatch({
            type: "CHAR_EDIT",
            field: "trained_skills_history",
            level: ev.target.id.split("_")[3].split("-")[1],
            src: ev.target.id.split("_")[2],
            payload: ev.target.value
        });
    }

    useEffect(() => {
        if (state.cur && state.cur.stats.trained_skills_history[0]) {
            document.getElementById("meb_charTrainSkill_default1_level-0").value =
                state.cur.stats.trained_skills_history[0].default1;
            document.getElementById("meb_charTrainSkill_default2_level-0").value =
                state.cur.stats.trained_skills_history[0].default2;
        }
    }, [state.cur])

    return (
        <section className="configure-skills rows">
            <h2>Skills</h2>
            <section className="trained columns">
                <label>Initial Trained Skills:</label>
                <select onChange={trainSkill} id="meb_charTrainSkill_default1_level-0">
                    <option value="Choose">Choose</option>
                    {gc.skills_list.map((skill) => (
                        <option key={skill} value={skill}>{skill}</option>
                    ))}
                </select>
                <select onChange={trainSkill} id="meb_charTrainSkill_default2_level-0">
                    <option value="Choose">Choose</option>
                    {gc.skills_list.map((skill) => (
                        <option key={skill} value={skill}>{skill}</option>
                    ))}
                </select>
            </section>
            <section className="net-ranks-display">
                <table>
                    <tbody>
                        <tr>
                            <th>Skill:</th>
                            {gc.skills_list.map((skill) => (
                                <td key={skill}><span>{skill}</span></td>
                            ))}
                        </tr>
                        <tr>
                            <th>Ranks:</th>
                            {state.cur ? gc.skills_list.map((skill) => (
                                <td key={skill}><span>{state.cur.stats.skill_ranks[skill]}</span></td>
                            )) : 
                            gc.skills_list.map((skill) => (
                                <td key={skill} />
                            ))}
                        </tr>
                    </tbody>
                </table>
            </section>
        </section>
    );
}

export default ConfigureSkills;