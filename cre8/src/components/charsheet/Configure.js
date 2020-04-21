import React, { useState, useEffect, useRef, useContext } from 'react';
import { Context } from '../GlobalWrapper';
import useFormGlobalLink from '../../hooks/useFormGlobalLink';

import MyButton from '../ui/MyButton';
import gc from '../../helpers/GameConstants';
import { mineTrainedSkillsRequired, updateGoodSave, updateSkillRanks } from '../../helpers/Calculations';

const Configure = () => {
    const [state, dispatch] = useContext(Context);
    // const [cur, setCur] = useGlobal("cur");
    // const [toggleEditing] = useGlobal("toggleEditingFct");
    // const [editStat] = useGlobal("editStatFct");
    // const [escFormFct] = useGlobal("escFormFct");
    // const [currentInputs, setCurrentInputs] = useGlobal("currentInputs");

    const trainedSkills = useRef([]);
    const trainedSkillsReq = useRef([]);
    const [levelsArray, setLevelsArray] = useState([]);
    const [upTo5Array, setUpTo5Array] = useState([]);
    useEffect(() => {
        if (state.cur) {
            document.querySelector(`#meb_setgoodsave_${state.cur.stats.good_save}`).parentNode.classList.add("selected");
            
            trainedSkillsReq.current = mineTrainedSkillsRequired(state.cur.stats.trained_skills_required);
            trainedSkills.current = state.cur.stats.trained_skills;
            gc.skills_list.forEach(skill => {
                if (trainedSkillsReq.current.includes(skill)) {
                    document.querySelector(`#meb_trained_checkbox_${skill}`).setAttribute("disabled", "true");
                    document.querySelector(`#meb_trained_checkbox_${skill}`).setAttribute("checked", "checked");
                } else if (trainedSkills.current.includes(skill)) {
                    document.querySelector(`#meb_trained_checkbox_${skill}`).setAttribute("checked", "checked");
                }
            });

            const tempLevelsArray = [];
            const tempUpTo5Array = [];
            for (let i = 0; i < state.cur.stats.level_max8; i++) {
                tempLevelsArray.push(i);
            }
            for (let i = 0; i < gc.skill_ranks_per_level; i++) {
                tempUpTo5Array.push(i);
            }
            setLevelsArray(tempLevelsArray);
            setUpTo5Array(tempUpTo5Array);
        }
    }, [state.cur])

    const setGoodSave = (ev) => {
        if (state.cur) {
            const newVal = ev.target.id.split("_")[2];
            dispatch({ type: "SET", key: "cur", payload: {
                ...state.cur,
                stats: updateGoodSave({
                    ...state.cur.stats,
                    good_save: newVal
                })
            } });
            document.querySelectorAll(".parchment .good-save .my-button").forEach(button => {
                button.classList.remove("selected");
            });
            ev.target.closest("div").classList.add("selected");
        }
    }

    const trainSkillToggle = (ev) => {
        const box = document.getElementById(ev.target.id);
        if (!state.cur) {
            box.checked = false;
        } else {
            // console.log(box, skill, box.checked);
            const skill = ev.target.id.split("_")[3];
            const on = box.checked;
            const trainedSkills = state.cur.stats.trained_skills;
            let changeWasMade = true;
            if (on && trainedSkills.length < state.cur.stats.trained_skills_num && !trainedSkills.includes(skill)) {
                trainedSkills.push(skill);
            } else if (!on && trainedSkills.includes(skill)) {
                trainedSkills.splice(trainedSkills.indexOf(skill), 1);
            } else if (on && !trainedSkills.includes(skill)) {
                box.checked = false;
                changeWasMade = false;
            }
            if (changeWasMade) {
                dispatch({ type: "SET", key: "cur", payload: {
                    ...state.cur,
                    stats: updateSkillRanks({
                        ...state.cur.stats,
                        trained_skills: trainedSkills
                    })
                } });
            }
        }
    }

    const protectedLoadingSkillRanks = useRef(false);
    useEffect(() => {
        protectedLoadingSkillRanks.current = true;

        if (state.cur) {
            const history = state.cur.stats.skill_ranks_history;
            for (let level = 0; level < state.cur.stats.level_max8; level++) {
                if (history.hasOwnProperty(level)) {
                    const ranksArr = history[level];
                    for (let j = 0; j < Math.min(ranksArr.length, gc.skill_ranks_per_level); j++) {
                        if (ranksArr[j]) {
                            const el = document.getElementById(`meb_skillrank_${level}_${j}`);
                            if (el) {
                                el.value = ranksArr[j];
                            }
                        }
                    }
                }
            }
        }

        protectedLoadingSkillRanks.current = false;
    }, [state.cur, levelsArray, upTo5Array])
    const assignSkillRank = (ev) => {
        if (!protectedLoadingSkillRanks.current) {
            const level = ev.target.id.split("_")[2];
            const col = ev.target.id.split("_")[3];
            let skillAdded = ev.target.value;
            const skillsList = gc.skills_list;
            if (!skillsList.includes(skillAdded)) {
                skillAdded = null;
            }
            if (state.cur) {
                const skill_ranks_history = state.cur.stats.skill_ranks_history;
                for (let lev = 0; lev <= level; lev++) {
                    if (skill_ranks_history[lev] === undefined) {
                        skill_ranks_history[lev] = [];
                    }
                }
                while (skill_ranks_history[level].length <= col) {
                    skill_ranks_history[level].push(null);
                }
                skill_ranks_history[level][col] = skillAdded;
                dispatch({ type: "SET", key: "cur", payload: {
                    ...state.cur,
                    stats: updateSkillRanks({
                        ...state.cur.stats,
                        skill_ranks_history
                    })
                } });
            }
        }
    }

    const { handleInputChange, handleSubmit } = useFormGlobalLink(state.editStat, state.currentInputs, state.setCurrentInputs);

    return(
        <div className="right-padding" onKeyDown={state.escFormFct}>
            <header>
                <header>
                    <div className="meb-contain-edit">
                        <h1 className="char-sheet-name editable" onClick={state.toggleEditing} id="meb_tog_name">{state.cur.name}</h1>
                        <form className="meb-popout-edit" onSubmit={handleSubmit} id="meb_editform_name">
                            <input type="text" onChange={handleInputChange} id="meb_editval_name" />
                            <button type="submit">Enter</button>
                        </form>
                    </div>
                    <div className="column-envelope space-between">
                        <h2 className="subtitle">
                            <span className="float-left-element-space">Level {state.cur.stats.level}</span>
                            <span className="meb-contain-edit">
                                <span className="editable" onClick={state.toggleEditing} id="meb_tog_epithet">{state.cur.stats.epithet}</span>
                                <form className="meb-popout-edit" onSubmit={handleSubmit} id="meb_editform_epithet">
                                    <input type="text" onChange={handleInputChange} id="meb_editval_epithet" />
                                    <button type="submit">Enter</button>
                                </form>
                            </span>
                        </h2>
                        <div className="column-envelope">
                            <span className="meb-contain-edit stat float-right-element">
                                <span className="editable bold" onClick={state.toggleEditing} id="meb_tog_xpBase">
                                    Base XP: {state.cur.stats.xp_base}
                                </span>
                                <form className="meb-popout-edit" onSubmit={handleSubmit} id="meb_editform_xpBase">
                                    <input type="number" onChange={handleInputChange} id="meb_editval_xpBase" />
                                    <button type="submit">Enter</button>
                                </form>
                            </span>
                            <span className="stat float-right-element bold">XP: {state.cur.stats.xp}</span>
                            <span className="stat float-right-element bold">Next Level At: {state.cur.stats.next_level_at}</span>
                        </div>
                    </div>
                </header>
                <section className="good-save">
                    <h2 className="section-head">Good Save:</h2>
                    <div className="column-envelope">
                        <MyButton fct={setGoodSave} evData="meb_setgoodsave_fortitude">Fortitude</MyButton>
                        <MyButton fct={setGoodSave} evData="meb_setgoodsave_reflex">Reflex</MyButton>
                        <MyButton fct={setGoodSave} evData="meb_setgoodsave_willpower">Willpower</MyButton>
                    </div>
                </section>
                <section className="column-envelope top-breakdowns">
                    <section className="pools-breakdown">
                        <div className="column-envelope breakdown">
                            <div className="fill-in">
                                <p className="big-num">{state.cur.stats.vp_max}</p>
                                <p className="caption">Vitality<br />Points</p>
                            </div>
                            <div className="equals-symbol">
                                =
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{2 * state.cur.stats.level_max8}</p>
                                <p className="caption">2x Level</p>
                            </div>
                            <div className="plus-symbol">
                                +
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{state.cur.stats.vp_kits_total}</p>
                                <p className="caption">Kits<br />boosts</p>
                            </div>
                            <div className="plus-symbol">
                                +
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{state.cur.stats.fortitude_base_total}</p>
                                <p className="caption">Base<br />Fortitude</p>
                            </div>
                            <div className="plus-symbol">
                                +
                            </div>
                            <div>
                                <p className="big-num trailing-num">{gc.base_vitality_points}</p>
                            </div>
                        </div>
                        <div className="column-envelope breakdown">
                            <div className="fill-in">
                                <p className="big-num">{state.cur.stats.rp_max}</p>
                                <p className="caption">Reserve<br />Points</p>
                            </div>
                            <div className="equals-symbol">
                                =
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{state.cur.stats.rp_mods_total}</p>
                                <p className="caption">Misc.<br />bonuses</p>
                            </div>
                            <div className="plus-symbol">
                                +
                            </div>
                            <div>
                                <p className="big-num trailing-num">{gc.base_reserve_points}</p>
                            </div>
                        </div>
                        <div className="column-envelope breakdown">
                            <div className="fill-in">
                                <p className="big-num">{state.cur.stats.mp_max}</p>
                                <p className="caption">Magic<br />Points</p>
                            </div>
                            <div className="equals-symbol">
                                =
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{state.cur.stats.caster_level}</p>
                                <p className="caption">Caster<br />Level</p>
                            </div>
                            <div className="plus-symbol">
                                +
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{state.cur.stats.mp_mods_total}</p>
                                <p className="caption">Misc.<br />bonuses</p>
                            </div>
                        </div>
                    </section>
                    <section className="sublevels-breakdown">
                        <div className="column-envelope breakdown">
                            <div className="fill-in">
                                <p className="big-num">{state.cur.stats.fighting_level}</p>
                                <p className="caption">Fighting<br />Level</p>
                            </div>
                            <div className="equals-symbol">
                                =
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{state.cur.stats.heroic_bonus}</p>
                                <p className="caption">1/2-Level</p>
                            </div>
                            <div className="plus-symbol">
                                +
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{state.cur.stats.fighting_level_kits_total}</p>
                                <p className="caption">Kits<br />boosts</p>
                            </div>
                        </div>
                        <div className="column-envelope breakdown">
                            <div className="fill-in">
                                <p className="big-num">{state.cur.stats.caster_level}</p>
                                <p className="caption">Caster<br />Level</p>
                            </div>
                            <div className="equals-symbol">
                                =
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{state.cur.stats.heroic_bonus}</p>
                                <p className="caption">1/2-Level</p>
                            </div>
                            <div className="plus-symbol">
                                +
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{state.cur.stats.caster_level_kits_total}</p>
                                <p className="caption">Kits<br />boosts</p>
                            </div>
                        </div>
                        <div className="column-envelope breakdown">
                            <div className="fill-in">
                                <p className="big-num">{state.cur.stats.coast_number}</p>
                                <p className="caption">Coast<br />Number</p>
                            </div>
                            <div className="equals-symbol">
                                =
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{state.cur.stats.heroic_bonus}</p>
                                <p className="caption">1/2-Level</p>
                            </div>
                            <div className="plus-symbol">
                                +
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{state.cur.stats.coast_number_kits_total}</p>
                                <p className="caption">Kits<br />boosts</p>
                            </div>
                            <div className="plus-symbol">
                                +
                            </div>
                            <div>
                                <p className="big-num trailing-num">{gc.base_coast_number}</p>
                            </div>
                        </div>
                        <div className="column-envelope breakdown">
                            <div className="fill-in">
                                <p className="big-num">{state.cur.stats.awesome_check >= 0 ? "+" : null}{state.cur.stats.awesome_check}</p>
                                <p className="caption">Awesome<br />Check</p>
                            </div>
                            <div className="equals-symbol">
                                =
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{state.cur.stats.level_max8}</p>
                                <p className="caption">Level</p>
                            </div>
                            <div className="plus-symbol">
                                +
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{state.cur.stats.awesome_mods_total}</p>
                                <p className="caption">Misc.<br />bonuses</p>
                            </div>
                            <div className="plus-symbol">
                                +
                            </div>
                            <div>
                                <p className="big-num trailing-num">{gc.base_awesome_bonus}</p>
                            </div>
                        </div>
                    </section>
                </section>
            </header>
            <section>
                <h2 className="section-head">Skills</h2>
                <section className="column-envelope space-between trained-skills">
                    <h3 className="trained-skills">Trained Skills: {state.cur.stats.trained_skills_num}</h3>
                    <table className="checkbox-bank">
                        <tbody>
                            <tr>
                            {gc.skills_list.slice(0, Math.ceil(gc.skills_list_num / 2)).map((skill, i) => (
                                <td key={skill} className="checkbox-pair">
                                    <div>
                                        <input type="checkbox" onClick={trainSkillToggle} id={`meb_trained_checkbox_${skill}`} /> <span>{skill}</span>
                                    </div>
                                </td>
                            ))}
                            </tr>
                            <tr>
                            {gc.skills_list.slice(Math.ceil(gc.skills_list_num / 2), gc.skills_list_num).map((skill, i) => (
                                <td key={skill} className="checkbox-pair">
                                    <div>
                                        <input type="checkbox" onChange={trainSkillToggle} id={`meb_trained_checkbox_${skill}`} /> <span>{skill}</span>
                                    </div>
                                </td>
                            ))}
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section>
                    <h3 className="skill-ranks">Skill Ranks Assignment</h3>
                    <table className="skill-ranks-assignment">
                        <tbody>
                            {levelsArray.map(level => (
                                <tr key={level}>
                                    <th>Level {level + 1}:</th>
                                    {upTo5Array.map(col => (
                                        <td key={col}>
                                            <select onChange={assignSkillRank} id={`meb_skillrank_${level}_${col}`}>
                                                <option value="Select Skill">Select Skill</option>
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
            </section>
        </div>
    );
}

export default Configure;