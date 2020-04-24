import React, { useEffect, useRef, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import gc from '../../helpers/GameConstants';

const PlayConditions = () => {
    const [state, dispatch] = useContext(Store);

    const checkCoasting = (ev) => {
        const box = document.getElementById(ev.target.id);
        if (box.checked) {
            dispatch({ type: "CHAR_EDIT", field: "coasting", payload: true });
        } else {
            dispatch({ type: "CHAR_EDIT", field: "coasting", payload: false });
        }
    }

    const checkCondition = (ev) => {
        const box = document.getElementById(ev.target.id);
        if (!state.cur) {
            box.checked = false;
        } else {
            const condition = ev.target.id.split("_")[2];
            const on = box.checked;
            const { active_conditions } = state.cur.stats;
            let changeWasMade = true;
            if (on && !active_conditions.includes(condition)) {
                active_conditions.push(condition);
            } else if (!on && active_conditions.includes(condition)) {
                active_conditions.splice(active_conditions.indexOf(condition), 1);
            } else {
                changeWasMade = false;
            }
            if (changeWasMade) {
                dispatch({ type: "CHAR_EDIT", field: "active_conditions", payload: active_conditions });
            }
        }
    }

    const selectDieMode = (ev) => {
        dispatch({ type: "SET", key: "dieRollMode", payload: ev.target.value });
    }

    const curRef = useRef(null);
    useEffect(() => {
        const matchCheckboxes = () => {
            const active = state.cur.stats.active_conditions;
            gc.basic_conditions.concat(gc.other_conditions).forEach(condition => {
                const box = document.getElementById(`meb_checkCondition_${condition}`);
                if (active.includes(condition)) {
                    box.checked = true;
                } else {
                    box.checked = false;
                }
            });

            document.getElementById("meb_check_coasting").checked = state.cur.coasting;
        }

        if (state.cur && !curRef.current) {
            matchCheckboxes();
            curRef.current = state.cur;
        } else if (state.cur && state.cur.stats.active_conditions !== curRef.current.stats.active_conditions) {
            matchCheckboxes();
            curRef.current = state.cur;
        } else if (state.cur && state.cur.coasting !== curRef.current.coasting) {
            matchCheckboxes();
            curRef.current = state.cur;
        }
    }, [state.cur])

    return (
        <section className="conditions">
            <div className="die-mode">
                <h3>d20 Die Modes:</h3>
                <select onChange={selectDieMode} defaultValue={state.dieRollMode} id="meb_select_d20dieMode">
                    <option value="boost">Boosted</option>
                    <option value="normal">Normal</option>
                    <option value="drag">Dragged</option>
                    <option value="both">Boosted & Dragged</option>
                </select>
                <div className="checkbox-pair">
                    <input type="checkbox" onClick={checkCoasting} id={"meb_check_coasting"} /> Coasting
                </div>
            </div>
            <div>
                <h3>Conditions</h3>
                <ul className="not-last">
                    {gc.basic_conditions.map(condition => (
                        <li key={condition} className="checkbox-pair">
                            <input type="checkbox" onClick={checkCondition} id={`meb_checkCondition_${condition}`} />
                            <span>{condition}</span>
                        </li>
                    ))}
                </ul>
                <ul>
                    {gc.other_conditions.map(condition => (
                        <li key={condition} className="checkbox-pair">
                            <input type="checkbox" onClick={checkCondition} id={`meb_checkCondition_${condition}`} />
                            <span>{condition}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

export default PlayConditions;