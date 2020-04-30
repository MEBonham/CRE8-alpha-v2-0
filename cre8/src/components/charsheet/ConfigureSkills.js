import React, { useState, useEffect, useContext, useCallback } from 'react';

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
            srcType: "automatic",
            payload: ev.target.value
        });
    }

    const assignSkillRank = (ev) => {
        dispatch({
            type: "CHAR_EDIT",
            field: "skill_ranks_history",
            level: ev.target.id.split("_")[2],
            col: ev.target.id.split("_")[3],
            skill: ev.target.value
        });
    }

    const selectPrimary = useCallback((ev) => {
        dispatch({
            type: "CHAR_EDIT",
            field: "primary_synergy",
            skill: ev.target.name.split("_")[2],
            primary: ev.target.value
        });
    }, [dispatch]);

    const [levelsArray, setLevelsArray] = useState([]);
    const [upTo5Array, setUpTo5Array] = useState([]);
    useEffect(() => {
        if (state.cur && state.cur.stats.trained_skills_history[0]) {
            document.getElementById("meb_charTrainSkill_default1_level-0").value =
                state.cur.stats.trained_skills_history[0].default1.skill;
            document.getElementById("meb_charTrainSkill_default2_level-0").value =
                state.cur.stats.trained_skills_history[0].default2.skill;
        }

        const tempLevelsArray = [];
        for (let i = 0; i < state.cur.stats.level_max8; i++) {
            tempLevelsArray.push(i);
        }
        setLevelsArray(tempLevelsArray);

        const tempUpTo5Array = [];
        for (let i = 0; i < gc.skill_ranks_per_level; i++) {
            tempUpTo5Array.push(i);
        }
        setUpTo5Array(tempUpTo5Array);

    }, [state.cur])

    const [tempHistory, setTempHistory] = useState({});
    useEffect(() => {
        let historyCopy = {};
        levelsArray.forEach((level) => {
            historyCopy[level] = [];
            upTo5Array.forEach((col) => {
                historyCopy[level][col] = null;
            });
        });
        if (state.cur) {
            historyCopy = {
                ...historyCopy,
                ...state.cur.stats.skill_ranks_history
            };
            setTempHistory(historyCopy);
        }
    }, [levelsArray, state.cur, upTo5Array])

    useEffect(() => {
        Object.keys(tempHistory).forEach((level) => {
            const ranksArr = tempHistory[level];
            ranksArr.forEach((value, col) => {
                const el = document.getElementById(`meb_skillRank_${level}_${col}`);
                if (el) {
                    el.value = value || "Choose";
                    el.disabled = false;
                }
            });
        });
    }, [tempHistory])

    const [synergyDiv, setSynergyDiv] = useState(null);
    useEffect(() => {
        const contents = Object.keys(state.cur.stats.synergy_bonuses).flatMap((skill) => {
            if (state.cur.stats.synergy_bonuses[skill].length && state.cur.stats.skill_ranks[skill] >= 3) {
                let defaultValue;
                state.cur.stats.synergy_bonuses[skill].forEach((bonusObj) => {
                    if (bonusObj.primary) defaultValue = bonusObj.to;
                });
                return ([
                    <div key={skill} className="rows">
                        <label>{skill}</label>
                        <select onChange={selectPrimary} name={`meb_primarySynergySelect_${skill}`} defaultValue={defaultValue}>
                            <option value={false}>Choose Primary</option>
                            {state.cur.stats.synergy_bonuses[skill].map((bonusObj) => (
                                <option key={bonusObj.to} value={bonusObj.to}>{bonusObj.display}</option>
                            ))}
                        </select>
                    </div>
                ]);
            } else {
                return [];
            }
        });
        setSynergyDiv(contents.length ?
            <div className="columns">
                {contents}
            </div> : null
        );
    }, [selectPrimary, state.cur])

    return (
        <section className="configure-skills rows">
            <h2>Skills</h2>
            <section className="trained columns">
                <label>Initial Trained Skills:</label>
                <select onChange={trainSkill} id="meb_charTrainSkill_default1_level-0" defaultValue="Choose">
                    <option value="Choose">Choose</option>
                    {gc.skills_list.map((skill) => (
                        <option key={skill} value={skill}>{skill}</option>
                    ))}
                </select>
                <select onChange={trainSkill} id="meb_charTrainSkill_default2_level-0" defaultValue="Choose">
                    <option value="Choose">Choose</option>
                    {gc.skills_list.map((skill) => (
                        <option key={skill} value={skill}>{skill}</option>
                    ))}
                </select>
            </section>
            <section className="ranks-assignment">
                <h3>Skill Ranks Assignment</h3>
                <table>
                    <tbody>
                        {levelsArray.map(level => (
                            <tr key={level}>
                                <th>Level {level + 1}:</th>
                                {upTo5Array.map(col => (
                                    <td key={col}>
                                        <select onChange={assignSkillRank} id={`meb_skillRank_${level}_${col}`} className="to-enable" disabled>
                                            <option value="Choose">Choose Skill</option>
                                            {gc.skills_list.map(skill => (
                                                <option key={skill} value={skill}>{skill}</option>
                                            ))}
                                        </select>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
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
            {synergyDiv ?
                <section className="synergies rows">
                    <label>Synergy Bonuses:</label>
                    {synergyDiv}
                </section> :
            null}
        </section>
    );
}

export default ConfigureSkills;