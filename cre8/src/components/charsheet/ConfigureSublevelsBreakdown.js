import React, { useContext } from 'react';

import { Store } from '../GlobalWrapper';
import gc from '../../helpers/GameConstants';

const ConfigureSublevelsBreakdown = () => {
    const [state] = useContext(Store);

    return (
        <section className="sublevels-breakdown">
            <div className="breakdown columns">
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
            <div className="breakdown columns">
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
            <div className="breakdown columns">
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
            <div className="breakdown columns">
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
    );
}

export default ConfigureSublevelsBreakdown;