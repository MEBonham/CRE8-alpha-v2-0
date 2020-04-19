import React, { useEffect, useRef } from 'react';
import useGlobal from '../../hooks/useGlobal';
import useFormGlobalLink from '../../hooks/useFormGlobalLink';

import MyButton from '../ui/MyButton';
import gc from '../../helpers/GameConstants';
import { mineTrainedSkillsRequired, updateGoodSave, updateSkillRanks } from '../../helpers/Calculations';

const Configure = () => {
    const [cur, setCur] = useGlobal("cur");
    const [toggleEditing] = useGlobal("toggleEditingFct");
    const [editStat] = useGlobal("editStatFct");
    const [escFormFct] = useGlobal("escFormFct");
    const [currentInputs, setCurrentInputs] = useGlobal("currentInputs");

    const trainedSkills = useRef([]);
    const trainedSkillsReq = useRef([]);
    const levelsArray = useRef([]);
    const upTo5Array = useRef([]);
    useEffect(() => {
        if (cur) {
            document.querySelector(`#meb_setgoodsave_${cur.stats.good_save}`).parentNode.classList.add("selected");
            
            trainedSkillsReq.current = mineTrainedSkillsRequired(cur.stats.trained_skills_required);
            trainedSkills.current = cur.stats.trained_skills;
            gc.skills_list.forEach(skill => {
                if (trainedSkillsReq.current.includes(skill)) {
                    document.querySelector(`#meb_trained_checkbox_${skill}`).setAttribute("disabled", "true");
                    document.querySelector(`#meb_trained_checkbox_${skill}`).setAttribute("checked", "checked");
                } else if (trainedSkills.current.includes(skill)) {
                    document.querySelector(`#meb_trained_checkbox_${skill}`).setAttribute("checked", "checked");
                }
            });

            levelsArray.current = [];
            upTo5Array.current = [];
            for (let i = 0; i < cur.stats.level_max8; i++) {
                levelsArray.current.push(i);
            }
            for (let i = 0; i < gc.skill_ranks_per_level; i++) {
                upTo5Array.current.push(i);
            }
        }
    }, [cur])

    const setGoodSave = (ev) => {
        const newVal = ev.target.id.split("_")[2];
        setCur({
            ...cur,
            stats: updateGoodSave({
                ...cur.stats,
                good_save: newVal
            })
        });
        document.querySelectorAll(".parchment .good-save .my-button").forEach(button => {
            button.classList.remove("selected");
        });
        ev.target.closest("div").classList.add("selected");
    }

    const trainSkillToggle = (ev) => {
        const box = document.getElementById(ev.target.id);
        if (!cur) {
            box.checked = false;
        } else {
            // console.log(box, skill, box.checked);
            const skill = ev.target.id.split("_")[3];
            const on = box.checked;
            const trainedSkills = cur.stats.trained_skills;
            let changeWasMade = true;
            if (on && trainedSkills.length < cur.stats.trained_skills_num && !trainedSkills.includes(skill)) {
                trainedSkills.push(skill);
            } else if (!on && trainedSkills.includes(skill)) {
                trainedSkills.splice(trainedSkills.indexOf(skill), 1);
            } else if (on && !trainedSkills.includes(skill)) {
                box.checked = false;
                changeWasMade = false;
            }
            if (changeWasMade) {
                setCur({
                    ...cur,
                    stats: updateSkillRanks({
                        ...cur.stats,
                        trained_skills: trainedSkills
                    })
                });
            }
        }
    }

    const { handleInputChange, handleSubmit } = useFormGlobalLink(editStat, currentInputs, setCurrentInputs);

    return(
        <div className="right-padding" onKeyDown={escFormFct}>
            <header>
                <header>
                    <div className="meb-contain-edit">
                        <h1 className="char-sheet-name editable" onClick={toggleEditing} id="meb_tog_name">{cur.name}</h1>
                        <form className="meb-popout-edit" onSubmit={handleSubmit} id="meb_editform_name">
                            <input type="text" onChange={handleInputChange} id="meb_editval_name" />
                            <button type="submit">Enter</button>
                        </form>
                    </div>
                    <div className="column-envelope space-between">
                        <h2 className="subtitle">
                            <span className="float-left-element-space">Level {cur.stats.level}</span>
                            <span className="meb-contain-edit">
                                <span className="editable" onClick={toggleEditing} id="meb_tog_epithet">{cur.stats.epithet}</span>
                                <form className="meb-popout-edit" onSubmit={handleSubmit} id="meb_editform_epithet">
                                    <input type="text" onChange={handleInputChange} id="meb_editval_epithet" />
                                    <button type="submit">Enter</button>
                                </form>
                            </span>
                        </h2>
                        <div className="column-envelope">
                            <span className="meb-contain-edit stat float-right-element">
                                <span className="editable bold" onClick={toggleEditing} id="meb_tog_xpBase">
                                    Base XP: {cur.stats.xp_base}
                                </span>
                                <form className="meb-popout-edit" onSubmit={handleSubmit} id="meb_editform_xpBase">
                                    <input type="number" onChange={handleInputChange} id="meb_editval_xpBase" />
                                    <button type="submit">Enter</button>
                                </form>
                            </span>
                            <span className="stat float-right-element bold">XP: {cur.stats.xp}</span>
                            <span className="stat float-right-element bold">Next Level At: {cur.stats.next_level_at}</span>
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
                                <p className="big-num">{cur.stats.vp_max}</p>
                                <p className="caption">Vitality<br />Points</p>
                            </div>
                            <div className="equals-symbol">
                                =
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{2 * cur.stats.level_max8}</p>
                                <p className="caption">2x Level</p>
                            </div>
                            <div className="plus-symbol">
                                +
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{cur.stats.vp_kits_total}</p>
                                <p className="caption">Kits<br />boosts</p>
                            </div>
                            <div className="plus-symbol">
                                +
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{cur.stats.fortitude_base_total}</p>
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
                                <p className="big-num">{cur.stats.rp_max}</p>
                                <p className="caption">Reserve<br />Points</p>
                            </div>
                            <div className="equals-symbol">
                                =
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{cur.stats.rp_mods_total}</p>
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
                                <p className="big-num">{cur.stats.mp_max}</p>
                                <p className="caption">Magic<br />Points</p>
                            </div>
                            <div className="equals-symbol">
                                =
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{cur.stats.caster_level}</p>
                                <p className="caption">Caster<br />Level</p>
                            </div>
                            <div className="plus-symbol">
                                +
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{cur.stats.mp_mods_total}</p>
                                <p className="caption">Misc.<br />bonuses</p>
                            </div>
                        </div>
                    </section>
                    <section className="sublevels-breakdown">
                        <div className="column-envelope breakdown">
                            <div className="fill-in">
                                <p className="big-num">{cur.stats.fighting_level}</p>
                                <p className="caption">Fighting<br />Level</p>
                            </div>
                            <div className="equals-symbol">
                                =
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{cur.stats.heroic_bonus}</p>
                                <p className="caption">1/2-Level</p>
                            </div>
                            <div className="plus-symbol">
                                +
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{cur.stats.fighting_level_kits_total}</p>
                                <p className="caption">Kits<br />boosts</p>
                            </div>
                        </div>
                        <div className="column-envelope breakdown">
                            <div className="fill-in">
                                <p className="big-num">{cur.stats.caster_level}</p>
                                <p className="caption">Caster<br />Level</p>
                            </div>
                            <div className="equals-symbol">
                                =
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{cur.stats.heroic_bonus}</p>
                                <p className="caption">1/2-Level</p>
                            </div>
                            <div className="plus-symbol">
                                +
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{cur.stats.caster_level_kits_total}</p>
                                <p className="caption">Kits<br />boosts</p>
                            </div>
                        </div>
                        <div className="column-envelope breakdown">
                            <div className="fill-in">
                                <p className="big-num">{cur.stats.coast_number}</p>
                                <p className="caption">Coast<br />Number</p>
                            </div>
                            <div className="equals-symbol">
                                =
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{cur.stats.heroic_bonus}</p>
                                <p className="caption">1/2-Level</p>
                            </div>
                            <div className="plus-symbol">
                                +
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{cur.stats.coast_number_kits_total}</p>
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
                                <p className="big-num">{cur.stats.awesome_check >= 0 ? "+" : null}{cur.stats.awesome_check}</p>
                                <p className="caption">Awesome<br />Check</p>
                            </div>
                            <div className="equals-symbol">
                                =
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{cur.stats.level_max8}</p>
                                <p className="caption">Level</p>
                            </div>
                            <div className="plus-symbol">
                                +
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{cur.stats.awesome_mods_total}</p>
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
                    <h3 className="trained-skills">Trained Skills: {cur.stats.trained_skills_num}</h3>
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
                            {levelsArray.current.map(level => (
                                <tr key={level}>
                                    <th>Level {level + 1}:</th>
                                    {upTo5Array.current.map(col => (
                                        <td key={col}>
                                            <select id={`meb_skillrank_${level}_${col}`}>
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