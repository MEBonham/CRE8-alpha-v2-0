import React, { useEffect, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import MyButton from '../ui/MyButton';

const ConfigureGoodSave = () => {
    const [state, dispatch] = useContext(Store);

    useEffect(() => {
        if (state.cur) {
            document.querySelectorAll(".parchment .good-save .my-button").forEach(button => {
                button.classList.remove("selected");
            });
            const string = `meb_setGoodSave_${state.cur.stats.good_save}`;
            document.getElementById(string).parentNode.classList.add("selected");
        }
    }, [state.cur])

    const setGoodSave = (ev) => {
        if (state.cur) {
            const newVal = ev.target.id.split("_")[2];
            document.querySelectorAll(".parchment .good-save .my-button").forEach(button => {
                button.classList.remove("selected");
            });
            dispatch({ type: "CHAR_EDIT", field: "good_save", payload: newVal });
            // ev.target.closest("div").classList.add("selected");
        }
    }

    return (
        <section className="good-save rows">
            <h2 className="section-head">Good Save:</h2>
            <div className="columns">
                <MyButton fct={setGoodSave} evData="meb_setGoodSave_fortitude">Fortitude</MyButton>
                <MyButton fct={setGoodSave} evData="meb_setGoodSave_reflex">Reflex</MyButton>
                <MyButton fct={setGoodSave} evData="meb_setGoodSave_willpower">Willpower</MyButton>
            </div>
        </section>
    );
}

export default ConfigureGoodSave;