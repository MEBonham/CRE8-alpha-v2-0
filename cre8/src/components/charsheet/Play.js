import React, { useEffect, useRef } from 'react';
import useFormGlobalLink from '../../hooks/useFormGlobalLink';
import useGlobal from '../../hooks/useGlobal';

import MyButton from '../ui/MyButton';
import gc from '../../helpers/GameConstants';
import { ifPlus } from '../../helpers/Calculations';
import d20Icon from '../../media/d20-icon.png';

const Play = () => {
    const [userInfo] = useGlobal("user");
    const [cur, setCur] = useGlobal("cur");
    const [latestRoll, setLatestRoll] = useGlobal("latestRoll");
    const [toggleEditing] = useGlobal("toggleEditingFct");
    const [editStat] = useGlobal("editStatFct");
    const [escFormFct] = useGlobal("escFormFct");
    const [currentInputs, setCurrentInputs] = useGlobal("currentInputs");
    const [dieRollMode, setDieRollMode] = useGlobal("dieRollMode");
    const [coasting, setCoasting] = useGlobal("coasting");
    const coastingRef = useRef(coasting);

    useEffect(() => {
        if (cur) {
            let el = document.querySelector("section.pools .vp .bar .inner-bar");
            let percent = 100 * cur.stats.vp / Math.max(0.5, cur.stats.vp_max);
            el.style.width = `${percent}%`;
            el = document.querySelector("section.pools .rp .bar .inner-bar");
            percent = 100 * cur.stats.rp / Math.max(0.5, cur.stats.rp_max);
            el.style.width = `${percent}%`;
            el = document.querySelector("section.pools .mp .bar .inner-bar");
            percent = 100 * cur.stats.mp / Math.max(0.5, cur.stats.mp_max);
            el.style.width = `${percent}%`;

            const active = cur.stats.active_conditions;
            gc.basic_conditions.concat(gc.other_conditions).forEach(condition => {
                const box = document.getElementById(`meb_checkcondition_${condition}`);
                if (active.includes(condition)) {
                    box.checked = true;
                } else {
                    box.checked = false;
                }
            });

            document.getElementById("meb_check_coasting").checked = coastingRef.current;
        }
    }, [cur])

    const selectDieMode = (ev) => {
        setDieRollMode(ev.target.value);
    }

    const checkCondition = (ev) => {
        const box = document.getElementById(ev.target.id);
        if (!cur) {
            box.checked = false;
        } else {
            const condition = ev.target.id.split("_")[2];
            const on = box.checked;
            const {active_conditions} = cur.stats;
            let changeWasMade = true;
            if (on && !active_conditions.includes(condition)) {
                active_conditions.push(condition);
            } else if (!on && active_conditions.includes(condition)) {
                active_conditions.splice(active_conditions.indexOf(condition), 1);
            } else if (on && active_conditions.includes("Shaken") && condition === "Momentum") {
                box.checked = false;
                changeWasMade = false;
            } else {
                changeWasMade = false;
            }
            if (changeWasMade) {
                setCur({
                    ...cur,
                    stats: {
                        ...cur.stats,
                        active_conditions
                    }
                });
            }
        }
    }

    const checkCoasting = (ev) => {
        const box = document.getElementById(ev.target.id);
        if (box.checked) {
            coastingRef.current = true;
            setCoasting(true);
        } else {
            coastingRef.current = false;
            setCoasting(false);
        }
    }

    const resetDieMode = () => {
        document.getElementById("meb_select_dieMode").value = "normal";
        setDieRollMode("normal");
    }

    const rollRef = useRef(latestRoll);
    const generalRoll = (ev) => {
        if (cur) {
            const userStamp = userInfo ? userInfo.uid : "anon";
            rollRef.current = {
                id: `${Date.now()}-${userStamp}`,
                processedLocally: false,
                processedBy: [],
                name: ev.target.id.split("_")[2].split("-").join(" "),
                character: cur.name,
                campaigns: cur.campaigns,
                dieMode: dieRollMode,
                dieModBasic: ev.target.id.split("_")[3],
                dieModsMisc: {},
                coasting: 0,
                type: "general roll"
            };
            setLatestRoll({
                ...rollRef.current
            });

            resetDieMode();
        }
    }

    const saveRoll = (ev) => {
        if (cur) {
            const dieModsMisc = {};
            if (cur.stats.active_conditions.includes("Wounded")) {
                dieModsMisc.wounded = {
                    wounded: {
                        num: gc.wounded_save_penalty
                    }
                };
            }
            const userStamp = userInfo ? userInfo.uid : "anon";
            rollRef.current = {
                id: `${Date.now()}-${userStamp}`,
                processedLocally: false,
                processedBy: [],
                name: ev.target.id.split("_")[2].split("-").join(" "),
                character: cur.name,
                campaigns: cur.campaigns,
                dieMode: dieRollMode,
                dieModBasic: ev.target.id.split("_")[3],
                dieModsMisc,
                coasting: 0,
                type: "saving throw"
            };
            setLatestRoll({
                ...rollRef.current
            });

            resetDieMode();
        }
    }
    
    const { handleInputChange, handleSubmit } = useFormGlobalLink(editStat, currentInputs, setCurrentInputs);
    return(
        <div className="right-padding" onKeyDown={escFormFct}>
            <header>
                <header>
                    <h1 className="char-sheet-name">{cur.name}</h1>
                    <div className="column-envelope space-between">
                        <h2 className="subtitle">Level {cur.stats.level} {cur.stats.epithet}</h2>
                        <div className="column-envelope">
                            <span className="stat float-right-element bold">XP: {cur.stats.xp}</span>
                            <div className="xp-button float-right-element meb-contain-edit">
                                <MyButton fct={toggleEditing} evData="meb_tog_earnXp">Earn XP</MyButton>
                                <form className="meb-popout-edit" onSubmit={handleSubmit} id="meb_editform_earnXp">
                                    <input
                                        type="number"
                                        onChange={handleInputChange}
                                        id="meb_editval_earnXp"
                                    />
                                    <button type="submit">Enter</button>
                                </form>
                            </div>
                            <span className="stat float-right-element bold">Next Level At: {cur.stats.next_level_at}</span>
                        </div>
                    </div>
                </header>
                <div className="column-envelope space-between">
                    <div className="row-envelope pools-n-general">
                        <section className="column-envelope pools">
                            <div className="vp">
                                <div className="pool-max">
                                    Pool: {cur.stats.vp_max}
                                </div>
                                <div className="bar">
                                    <div className="inner-bar" />
                                </div>
                                <div className="main-pool-val meb-contain-edit">
                                    <div className="above-big-num" />
                                    <p className="big-num editable" onClick={toggleEditing} id="meb_tog_vp">{cur.stats.vp}</p>
                                    <form className="meb-popout-edit" onSubmit={handleSubmit} id="meb_editform_vp">
                                        <input
                                            type="number"
                                            onChange={handleInputChange}
                                            id="meb_editval_vp"
                                        />
                                        <button type="submit">Enter</button>
                                    </form>
                                    <div className="below-big-num" />
                                    <p className="small">VP</p>
                                </div>
                            </div>
                            <div className="rp">
                                <div className="pool-max">
                                    Pool: {cur.stats.rp_max}
                                </div>
                                <div className="bar">
                                    <div className="inner-bar" />
                                </div>
                                <div className="main-pool-val meb-contain-edit">
                                    <div className="above-big-num" />
                                    <p className="big-num editable" onClick={toggleEditing} id="meb_tog_rp">{cur.stats.rp}</p>
                                    <form className="meb-popout-edit" onSubmit={handleSubmit} id="meb_editform_rp">
                                        <input
                                            type="number"
                                            onChange={handleInputChange}
                                            id="meb_editval_rp"
                                        />
                                        <button type="submit">Enter</button>
                                    </form>
                                    <div className="below-big-num" />
                                    <p className="small">RP</p>
                                </div>
                            </div>
                            <div className="mp">
                                <div className="pool-max">
                                    Pool: {cur.stats.mp_max}
                                </div>
                                <div className="bar">
                                    <div className="inner-bar" />
                                </div>
                                <div className="main-pool-val meb-contain-edit">
                                    <div className="above-big-num" />
                                    <p className="big-num editable" onClick={toggleEditing} id="meb_tog_mp">{cur.stats.mp}</p>
                                    <form className="meb-popout-edit" onSubmit={handleSubmit} id="meb_editform_mp">
                                        <input
                                            type="number"
                                            onChange={handleInputChange}
                                            id="meb_editval_mp"
                                        />
                                        <button type="submit">Enter</button>
                                    </form>
                                    <div className="below-big-num" />
                                    <p className="small">MP</p>
                                </div>
                            </div>
                        </section>
                        <section className="general-rolls column-envelope">
                            <div className="general-general row-envelope">
                                <MyButton fct={generalRoll} evData={`meb_roll_Heroics-Check_${cur.stats.heroic_bonus}`}>
                                    <img src={d20Icon} alt="" />
                                    Heroics Check ({ifPlus(cur.stats.heroic_bonus) + cur.stats.heroic_bonus})
                                </MyButton>
                                <MyButton fct={generalRoll} evData={`meb_roll_Awesome-Check_${cur.stats.awesome_check}`}>
                                    <img src={d20Icon} alt="" />
                                    Awesome Check ({ifPlus(cur.stats.awesome_check) + cur.stats.awesome_check})
                                </MyButton>
                                <MyButton fct={generalRoll} evData={`meb_roll_Spellcraft-Check_${cur.stats.spellcraft_check}`}>
                                    <img src={d20Icon} alt="" />
                                    Spellcraft Check ({ifPlus(cur.stats.spellcraft_check) + cur.stats.spellcraft_check})
                                </MyButton>
                                <MyButton fct={generalRoll} evData={`meb_roll_Speed-Check_${cur.stats.speed}`}>
                                    <img src={d20Icon} alt="" />
                                    Speed Check ({ifPlus(cur.stats.speed) + cur.stats.speed})
                                </MyButton>
                            </div>
                            <div className="saving-throws row-envelope">
                                <MyButton fct={saveRoll} evData={`meb_roll_Defense-Save_${cur.stats.defense_total}`}>
                                    <img src={d20Icon} alt="" />
                                    Defense Save ({ifPlus(cur.stats.defense_total) + cur.stats.defense_total})
                                </MyButton>
                                <MyButton fct={saveRoll} evData={`meb_roll_Fortitude-Save_${cur.stats.fortitude_total}`}>
                                    <img src={d20Icon} alt="" />
                                    Fortitude Save ({ifPlus(cur.stats.fortitude_total) + cur.stats.fortitude_total})
                                </MyButton>
                                <MyButton fct={saveRoll} evData={`meb_roll_Reflex-Save_${cur.stats.reflex_total}`}>
                                    <img src={d20Icon} alt="" />
                                    Reflex Save ({ifPlus(cur.stats.reflex_total) + cur.stats.reflex_total})
                                </MyButton>
                                <MyButton fct={saveRoll} evData={`meb_roll_Willpower-Save_${cur.stats.willpower_total}`}>
                                    <img src={d20Icon} alt="" />
                                    Willpower Save ({ifPlus(cur.stats.willpower_total) + cur.stats.willpower_total})
                                </MyButton>
                            </div>
                        </section>
                    </div>
                    <section className="conditions">
                        <div className="die-mode">
                            <h3>d20 Die Modes:</h3>
                            <select onChange={selectDieMode} defaultValue={dieRollMode} id="meb_select_dieMode">
                                <option value="boost">Boosted</option>
                                <option value="normal">Normal</option>
                                <option value="drag">Dragged</option>
                                <option value="both">Boosted & Dragged</option>
                            </select>
                            <div>
                                <input type="checkbox" onClick={checkCoasting} id={"meb_check_coasting"} /> Coasting
                            </div>
                        </div>
                        <div>
                            <h3>Conditions</h3>
                            <ul className="not-last">
                                {gc.basic_conditions.map(condition => (
                                    <li key={condition} className="checkbox-pair">
                                        <input type="checkbox" onClick={checkCondition} id={`meb_checkcondition_${condition}`} />
                                        <span>{condition}</span>
                                    </li>
                                ))}
                            </ul>
                            <ul>
                                {gc.other_conditions.map(condition => (
                                    <li key={condition} className="checkbox-pair">
                                        <input type="checkbox" onClick={checkCondition} id={`meb_checkcondition_${condition}`} />
                                        <span>{condition}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                </div>
            </header>
        </div>
    );
}

export default Play;