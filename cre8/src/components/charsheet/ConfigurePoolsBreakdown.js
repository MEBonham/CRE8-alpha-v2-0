import React, { useContext } from 'react';

import { Store } from '../GlobalWrapper';
import gc from '../../helpers/GameConstants';

const ConfigurePoolsBreakdown = () => {
    const [state] = useContext(Store);

    return (
        <section className="pools-breakdown rows">
            <div className="breakdown columns">
                <div className="fill-in">
                    <p className="big-num">{state.cur.stats.vp_max}</p>
                    {
                        state.cur.stats.traits_from_kits.includes("Hit Points") ?
                        <p className="caption">Hit<br />Points</p> :
                        <p className="caption">Vitality<br />Points</p>
                    }
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
            <div className="breakdown columns">
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
            <div className="breakdown columns">
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
    );
}

export default ConfigurePoolsBreakdown;