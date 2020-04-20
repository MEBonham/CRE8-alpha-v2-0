import React from 'react';
import useForm from '../../hooks/useForm';
import useGlobal from '../../hooks/useGlobal';

import MyButton from '../ui/MyButton';
import { updateBaseXp } from '../../helpers/Calculations';

const Play = () => {
    const [cur, setCur] = useGlobal("cur");
    const [toggleEditing] = useGlobal("toggleEditingFct");
    const [escFormFct] = useGlobal("escFormFct");

    const earnXP = (ev) => {
        const key = ev.target.id.split("_")[2];
        const valHolderId = `meb_editval_${key}`;
        const newVal = (parseInt(inputs[valHolderId]) || 0);
        setCur({
            ...cur,
            stats: updateBaseXp({
                ...cur.stats,
                xp_base: Math.max(0, cur.stats.xp_base + newVal)
            })
        })
        document.getElementById(ev.target.id).classList.remove("meb-open");
    }
    const { inputs, handleInputChange, handleSubmit } = useForm(earnXP);
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
                                        value={inputs.meb_editval_earnXp || 0}
                                        id="meb_editval_earnXp"
                                    />
                                    <button type="submit">Enter</button>
                                </form>
                            </div>
                            <span className="stat float-right-element bold">Next Level At: {cur.stats.next_level_at}</span>
                        </div>
                    </div>
                </header>
            </header>
        </div>
    );
}

export default Play;