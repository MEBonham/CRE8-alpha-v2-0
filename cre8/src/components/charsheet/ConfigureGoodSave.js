import React, { useContext } from 'react';

import { Store } from '../GlobalWrapper';
import MyButton from '../ui/MyButton';

const ConfigureGoodSave = () => {
    const [state, dispatch] = useContext(Store);

    const setGoodSave = (ev) => {
        if (state.cur) {
            const newVal = ev.target.id.split("_")[2];
            dispatch({ type: "CHAR_EDIT", field: "goodSave", payload: newVal });
            document.querySelectorAll(".parchment .good-save .my-button").forEach(button => {
                button.classList.remove("selected");
            });
            ev.target.closest("div").classList.add("selected");
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