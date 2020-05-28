import React, { useEffect, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import useFormGlobalScope from '../../hooks/useFormGlobalScope';

const PlayPools = () => {
    const [state, dispatch] = useContext(Store);
    const { handleInputChange, handleSubmit } = useFormGlobalScope(state.editCharFct, state.inputs, dispatch);

    useEffect(() => {
        if (state.cur) {
            let el = document.querySelector("section.pools .vp .bar .inner-bar");
            let percent = 100 * state.cur.stats.vp / Math.max(0.5, state.cur.stats.vp_max);
            el.style.width = `${percent}%`;
            el = document.querySelector("section.pools .rp .bar .inner-bar");
            percent = 100 * state.cur.stats.rp / Math.max(0.5, state.cur.stats.rp_max);
            el.style.width = `${percent}%`;
            el = document.querySelector("section.pools .mp .bar .inner-bar");
            percent = 100 * state.cur.stats.mp / Math.max(0.5, state.cur.stats.mp_max);
            el.style.width = `${percent}%`;
        }
    }, [state.cur])

    return (
        <section className="pools columns">
            <div className="vp">
                <div className="pool-max">
                    Pool: {state.cur.stats.vp_max}
                </div>
                <div className="bar">
                    <div className="inner-bar" />
                </div>
                <div className="main-pool-val meb-contain-edit">
                    <div className="above-big-num" />
                    <p className="big-num editable-text" onClick={state.toggleCharEditing} id="meb_togCharEdit_vp">
                        {state.cur.stats.vp}
                    </p>
                    <form className="meb-popout-edit rows" onSubmit={handleSubmit} id="meb_charEditForm_vp">
                        <label>(Add or Subtract)</label>
                        <div className="columns">
                            <input
                                type="number"
                                onChange={handleInputChange}
                                id="meb_charEditVal_vp"
                            />
                            <button type="submit">Enter</button>
                        </div>
                    </form>
                    <div className="below-big-num" />
                    <p className="small">{state.cur.stats.traits_from_kits.includes("Hit Points") ? "HP" : "VP"}</p>
                </div>
            </div>
            <div className="rp">
                <div className="pool-max">
                    Pool: {state.cur.stats.rp_max}
                </div>
                <div className="bar">
                    <div className="inner-bar" />
                </div>
                <div className="main-pool-val meb-contain-edit">
                    <div className="above-big-num" />
                    <p className="big-num editable-text" onClick={state.toggleCharEditing} id="meb_togCharEdit_rp">
                        {state.cur.stats.rp}
                    </p>
                    <form className="meb-popout-edit rows" onSubmit={handleSubmit} id="meb_charEditForm_rp">
                        <label>(Add or Subtract)</label>
                        <div className="columns">
                            <input
                                type="number"
                                onChange={handleInputChange}
                                id="meb_charEditVal_rp"
                            />
                            <button type="submit">Enter</button>
                        </div>
                    </form>
                    <div className="below-big-num" />
                    <p className="small">RP</p>
                </div>
            </div>
            <div className="mp">
                <div className="pool-max">
                    Pool: {state.cur.stats.mp_max}
                </div>
                <div className="bar">
                    <div className="inner-bar" />
                </div>
                <div className="main-pool-val meb-contain-edit">
                    <div className="above-big-num" />
                    <p className="big-num editable-text" onClick={state.toggleCharEditing} id="meb_togCharEdit_mp">
                        {state.cur.stats.mp}
                    </p>
                    <form className="meb-popout-edit rows" onSubmit={handleSubmit} id="meb_charEditForm_mp">
                        <label>(Add or Subtract)</label>
                        <div className="columns">
                            <input
                                type="number"
                                onChange={handleInputChange}
                                id="meb_charEditVal_mp"
                            />
                            <button type="submit">Enter</button>
                        </div>
                    </form>
                    <div className="below-big-num" />
                    <p className="small">MP</p>
                </div>
            </div>
        </section>
    );
}

export default PlayPools;