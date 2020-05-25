import React, { useState, useEffect, useRef, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import { getDisplayName } from '../../helpers/Calculations';
import { traitDescriptions } from '../../helpers/TraitDescriptions';
import { ifPlus } from '../../helpers/Calculations';
import LoadingAlert from '../other/LoadingAlert';
import '../../css/library.css';

const SpecialPreview = () => {
    const [state, dispatch] = useContext(Store);
    const scrollContainer = useRef(null);
    const [fillerComponent, setFillerComponent] = useState(<LoadingAlert />);
    useEffect(() => {
        if (state.preview.data && state.preview.data.id) {
            switch(state.preview.type) {
                case "feats":
                    dispatch({ type: "SET", key: "previewComponent", payload: previewFeat(state.preview.data) });
                    break;
                case "kits":
                    dispatch({ type: "SET", key: "previewComponent", payload: previewKit(state.preview.data) });
                    break;
                case "talents":
                    dispatch({ type: "SET", key: "previewComponent", payload: previewTalent(state.preview.data) });
                    break;
                default:
                    dispatch({ type: "SET", key: "previewComponent", payload: previewItem(state.preview.data) });
            }
        } else {
            setFillerComponent(null);
        }
    }, [dispatch, state.preview])

    useEffect(() => {
        if (state.previewComponent) {
            scrollContainer.current.scroll(0, 0);
        }
    }, [state.previewComponent])

    const previewKit = (data) => {
        // console.log(data);
        return(
            <>
                <header>
                    <h1>{data.name}</h1>
                    <h2 className="subtitle">
                        {data.tags.length ? 
                            <>
                                [
                                {data.tags.map((tag) => (tag)).join("] [")}
                                ]
                            </> :
                            null 
                        } Kit</h2>
                    <p className="prereqs"><strong>Prerequisites:</strong> {data.prereqs}</p>
                </header>
                <h2>Benefits:</h2>
                <ul>
                    {data.fighting_level_boost ?
                        <li>Fighting Level +1</li> :
                    null}
                    {data.caster_level_boost ?
                        <li>Caster Level +1</li> :
                    null}
                    {data.coast_number_boost ?
                        <li>Coast Number +1</li> :
                    null}
                    {data.fighting_OR_caster_boost ?
                        <li>Fighting Level +1 <span className="or">or</span> Caster Level +1</li> :
                    null}
                    {data.fighting_OR_coast_boost ?
                        <li>Fighting Level +1 <span className="or">or</span> Coast Number +1</li> :
                    null}
                    {data.caster_OR_coast_boost ?
                        <li>Caster Level +1 <span className="or">or</span> Coast Number +1</li> :
                    null}
                    {data.fightingRpBoost_OR_rpPlus2 ?
                        <>
                            <li>Fighting Level +1 <span className="or">or</span> RP +1</li>
                            <li>RP +1</li>
                        </> :
                    null}
                    {data.vpPlus2_OR_mpPlus2 ?
                        <li>VP +2 <span className="or">or</span> MP +2</li> :
                    null}
                    {data.vpPlus2_OR_buffTalent ?
                        <li>VP +2 <span className="or">or</span> gain a bonus [Buff] talent.</li> :
                    null}
                    {data.vp_boost > 0 ? <li>VP +{data.vp_boost}</li> : null}
                    {data.bonus_feat ? <li>Gain a bonus feat.</li> : null}
                    {data.bonus_talents.map((talent, i) => (
                        <li key={i}>Gain a bonus [{
                            Object.keys(talent).map((descriptor) => (
                                talent[descriptor].join("] or [")
                            ))
                        }] talent.</li>
                    ))}
                    {data.select_one_from_attacks ?
                        <li>
                            Gain {data.attacks.map((attackObj, i) => (
                                <span key={i}>
                                    a {attackObj.name} {attackObj.type === "natural_weapon" ? "natural weapon" : `${attackObj.type} attack`} (range {attackObj.range}, 
                                    base Impact {attackObj.impact_num_dice}d{attackObj.impact_dice_sides}, {Object.keys(attackObj.damage_type.base)
                                        .filter((type) => attackObj.damage_type.base[type]).join("/")} damage, 
                                    Peril modifier {`${ifPlus(attackObj.peril_mod)}${attackObj.peril_mod}`}{attackObj.detail ? `), details: ${attackObj.detail.slice(0, -1)}` : ")"}{(i < data.attacks.length - 1) ? <span> <span className="or">or</span> gain </span> : "."}
                                </span>
                            ))}
                        </li> :
                        data.attacks.map((attackObj, i) => (
                            <li key={i}>Gain a {attackObj.name} {attackObj.type === "natural_weapon" ? "natural weapon" : `${attackObj.type} attack`} (range {attackObj.range}, 
                                base Impact {attackObj.impact_num_dice}d{attackObj.impact_dice_sides}, {Object.keys(attackObj.damage_type.base)
                                    .filter((type) => attackObj.damage_type.base[type]).join("/")} damage, 
                                Peril modifier {`${ifPlus(attackObj.peril_mod)}${attackObj.peril_mod}`}). {attackObj.detail ? `Details: ${attackObj.detail}` : null}
                            </li>
                        ))
                    }
                    {data.bonus_trained_skills.map((training, i) => {
                        if (training.type === "fullMenu") {
                            return (<li key={i}>Train an additional skill.</li>)
                        } else if (training.type === "specific") {
                            return (<li key={i}>Train {training.options[0]}. If {training.options[0]} is already trained, you may immediately retrain that trained skill.</li>)
                        } else {
                            return (<li key={i}>Train {training.options.join(" or ")}.</li>)
                        }
                    })}
                    {data.various_bonuses.map((modObj, i) => {
                        if (modObj.type === "Synergy") {
                            return (<li key={i}>
                                Gain a{modObj.skill === "Athletics" ? "n" : null} {modObj.skill}-based
                                synergy bonus to your {getDisplayName(modObj.to)}.
                            </li>);
                        } else if (modObj.num > 0) {
                            return (<li key={i}>
                                Gain a +{modObj.num} {modObj.type} bonus to your {getDisplayName(modObj.to)}.
                            </li>);
                        } else {
                            return null;
                        }
                    })}
                    {data.melee_weapon_impact_plus1 ?
                        <li>
                            Gain a +1 feat bonus to the impact of your melee weapon attacks.
                        </li> :
                    null}
                    {parseInt(data.grow_bigger_level) ?
                        <li>
                            <em>From level {data.grow_bigger_level}:</em> Gain a +1 bonus to Size.
                        </li> :
                    null}
                    {data.passives.filter((passive) => !passive.drawback).map((passive, i) => (
                        <li key={i}>{passive.text}</li>
                    ))}
                    {data.free_actions.map((freeAction, i) => (
                        <li key={i}><em>Free Action:</em> {freeAction}</li>
                    ))}
                    {data.benefit_traits.map((trait, i) => (
                        <li key={i}><strong>{trait}:</strong> {traitDescriptions[trait]}</li>
                    ))}
                    {data.extended_rest_actions.map((restAction, i) => (
                        <li key={i}><em>Extended Rest:</em> {restAction}</li>
                    ))}
                </ul>
                {data.drawback_traits.length || data.various_penalties.length ?
                    <>
                        <h2>Drawbacks:</h2>
                        <ul>
                            {data.various_penalties.map((penalty, i) => (
                                <li key={i}>
                                    Incur a {penalty.num} {penalty.type === "Untyped" ? null : penalty.type} penalty 
                                    to your {getDisplayName(penalty.to)}.
                                </li>
                            ))}
                            {data.various_bonuses.map((modObj, i) => {
                                if (modObj.type !== "Synergy" && modObj.num < 0) {
                                    return (
                                        <li key={i}>
                                            Incur a {modObj.num} {modObj.type === "Untyped" ? null : modObj.type} penalty 
                                            to your {getDisplayName(modObj.to)}.
                                        </li>
                                    );
                                } else {
                                    return null;
                                }
                            })}
                            {data.passives.filter((passive) => passive.drawback).map((passive, i) => (
                                <li key={i}>{passive.text}</li>
                            ))}
                            {data.drawback_traits.map((trait, i) => (
                                <li key={i}><strong>{trait}:</strong> {traitDescriptions[trait]}</li>
                            ))}
                        </ul>
                    </> :
                null}
                {data.xp_parcels.length ?
                    <>
                        <h2>XP Parcels:</h2>
                        <ul>
                            {data.xp_parcels.map((parcel, i) => (
                                <li key={i}>{parcel}</li>
                            ))}
                        </ul>
                    </> :
                null}
            </>
        );
    }

    const previewFeat = (data) => {
        const actionTypes = [];
        if (data.attacks.length) {
            actionTypes.push("Attack");
        }
        if (data.standard_actions.length) {
            actionTypes.push("Standard");
        }
        if (data.move_actions.length) {
            actionTypes.push("Move");
        }
        if (data.swift_actions.length) {
            actionTypes.push("Swift");
        }
        if (data.opportunity_actions.length) {
            actionTypes.push("Opportunity");
        }
        if (data.free_actions.length) {
            actionTypes.push("Free");
        }
        if (data.short_rest_actions.length) {
            actionTypes.push("Short Rest");
        }
        if (data.extended_rest_actions.length) {
            actionTypes.push("Extended Rest");
        }

        const benefitsArr = data.benefit_traits.map((trait) => ({
            text: trait,
            type: "trait"
        })).concat(data.various_bonuses.flatMap((modObj, i) => {
            if (modObj.type === "Synergy") {
                return [({
                    text: `Gain a${modObj.skill === "Athletics" ? "n" : null} ${modObj.skill}-based
                    synergy bonus to your ${getDisplayName(modObj.to)}.`,
                    type: "bonus"
                })];
            } else if (modObj.num > 0) {
                return [({
                    text: `Gain a +${modObj.num} ${modObj.type} bonus to your ${getDisplayName(modObj.to)}.`,
                    type: "bonus"
                })];
            } else {
                return [];
            }
        })).concat(data.passives.filter((passiveFeatureObj) => !passiveFeatureObj.drawback).map((passiveFeatureObj) => ({
            text: passiveFeatureObj.text,
            type: "passive"
        })));

        const seedEffectsObj = {};
        data.seed_effects.forEach((effect) => {
            if (Object.keys(seedEffectsObj).includes(effect.seed)) {
                if (effect.Mp === "0" || 
                    effect.detail === `Using this spell with the ${effect.seed} seed works normally, but at a higher MP cost.`) {
                        seedEffectsObj[effect.seed].unshift({
                            Mp: effect.Mp,
                            detail: effect.detail,
                            heading: (effect.Mp === "0" || effect.Mp === 0) ? effect.seed : `${effect.seed} (+${effect.Mp} MP${effect.cumulative ? " cumulative" : ""})`
                        });
                } else {
                    seedEffectsObj[effect.seed].push({
                        Mp: effect.Mp,
                        detail: effect.detail,
                        heading: (effect.Mp === "0" || effect.Mp === 0) ? effect.seed : `${effect.seed} (+${effect.Mp} MP${effect.cumulative ? " cumulative" : ""})`
                    });
                }
            } else {
                seedEffectsObj[effect.seed] = [{
                    Mp: effect.Mp,
                    detail: effect.detail,
                    heading: (effect.Mp === "0" || effect.Mp === 0) ? effect.seed : `${effect.seed} (+${effect.Mp} MP${effect.cumulative ? " cumulative" : ""})`
                }];
            }
        });

        return(
            <>
                <header>
                    <h1>{data.name}</h1>
                    <h2 className="subtitle">[{data.tags.map((tag) => (tag)).join("] [")}] Talent</h2>
                    <p className="prereqs"><strong>Prerequisites:</strong> {data.prereqs}</p>
                    {data.expectation ? <p className="prereqs"><strong>Expectation:</strong> {data.expectation}</p> : null}
                    {data.tags.includes("Spell") ? 
                        <p><strong>Seeds:</strong> {data.applicable_seeds || "none"}</p> :
                    null}
                    <p className="action"><strong>Action:</strong> {actionTypes.join(" or ")}</p>
                </header>
                {actionTypes.length > 1 ? 
                    <>
                        <h2>Effects:</h2>
                        <ul>
                            {data.attacks.map((attackObj, i) => (
                                <li key={i}>Gain a {attackObj.name} {attackObj.type === "natural_weapon" ? "natural weapon" : `${attackObj.type} attack`} (range {attackObj.range}, 
                                    base Impact {attackObj.impact_num_dice}d{attackObj.impact_dice_sides}, {Object.keys(attackObj.damage_type.base).join("/")} damage, 
                                    Peril modifier {`${ifPlus(attackObj.peril_mod)}${attackObj.peril_mod}`}. {attackObj.detail ? `Details: ${attackObj.detail}` : null}
                                </li>
                            ))}
                            {data.standard_actions.map((standard, i) => (
                                <li key={i}>
                                    <em>Standard Action:</em> {standard}
                                </li>
                            ))}
                            {data.move_actions.map((move, i) => (
                                <li key={i}>
                                    <em>Move Action:</em> {move}
                                </li>
                            ))}
                            {data.swift_actions.map((swift, i) => (
                                <li key={i}>
                                    <em>Swift Action:</em> {swift}
                                </li>
                            ))}
                            {data.opportunity_actions.map((opportunity, i) => (
                                <li key={i}>
                                    <em>Opportunity Action:</em> {opportunity}
                                </li>
                            ))}
                            {data.free_actions.map((free, i) => (
                                <li key={i}>
                                    <em>Free Action:</em> {free}
                                </li>
                            ))}
                            {data.short_rest_actions.map((restAction, i) => (
                                <li key={i}>
                                    <em>Short Rest:</em> {restAction}
                                </li>
                            ))}
                            {data.extended_rest_actions.map((restAction, i) => (
                                <li key={i}>
                                    <em>Extended Rest:</em> {restAction}
                                </li>
                            ))}
                        </ul>
                    </> : 
                    <>
                        <h2>Effect:</h2>
                        {data.attacks.map((attackObj, i) => (
                            <p key={i}>Gain a {attackObj.name} {attackObj.type === "natural_weapon" ? "natural weapon" : `${attackObj.type} attack`} (range {attackObj.range}, 
                                base Impact {attackObj.impact_num_dice}d{attackObj.impact_dice_sides}, {Object.keys(attackObj.damage_type.base)
                                    .filter((damageType) => attackObj.damage_type.base[damageType]).join("/")} damage, 
                                Peril modifier {`${ifPlus(attackObj.peril_mod)}${attackObj.peril_mod}`}). {attackObj.detail ? `Details: ${attackObj.detail}` : null}
                            </p>
                        ))}
                        {data.standard_actions.map((standard, i) => (
                            <p key={i}>
                                {standard}
                            </p>
                        ))}
                        {data.move_actions.map((move, i) => (
                            <p key={i}>
                                {move}
                            </p>
                        ))}
                        {data.swift_actions.map((swift, i) => (
                            <p key={i}>
                                {swift}
                            </p>
                        ))}
                        {data.opportunity_actions.map((opportunity, i) => (
                            <p key={i}>
                                {opportunity}
                            </p>
                        ))}
                        {data.free_actions.map((free, i) => (
                            <p key={i}>
                                {free}
                            </p>
                        ))}
                        {data.short_rest_actions.map((restAction, i) => (
                            <p key={i}>
                                {restAction}
                            </p>
                        ))}
                        {data.extended_rest_actions.map((restAction, i) => (
                            <p key={i}>
                                {restAction}
                            </p>
                        ))}
                    </>}
                {data.tags.includes("Spell") && data.augment_options.length ?
                    <section>
                        <h3>Augmentations:</h3>
                        <ul>
                            {data.augment_options.sort((a, b) => (a.Mp - b.Mp)).map((option, i) => (
                                <li key={i}>
                                    <strong>MP +{option.Mp}{option.cumulative ? " (cumulative)" : null}:</strong> {option.detail}
                                </li>
                            ))}
                        </ul>
                    </section> :
                null}
                {data.tags.includes("Spell") ?
                    <section>
                        <h3>Seed Effects:</h3>
                        <ul>
                            {Object.keys(seedEffectsObj).sort((a, b) => {
                                if (a === "Any") return -1;
                                if (b === "Any") return 1;
                                if (a.toUpperCase() < b.toUpperCase()) return -1;
                                if (a.toUpperCase() > b.toUpperCase()) return 1;
                                return 0;
                            })
                                .map((seedName) => (
                                    <li key={seedName}>
                                        <strong>{seedEffectsObj[seedName][0].heading}:</strong> {seedEffectsObj[seedName][0].detail}
                                        {seedEffectsObj[seedName].length > 1 ?
                                            <>
                                                <div className="height-4px" />
                                                <ul>
                                                    {seedEffectsObj[seedName].slice(1).map((effectObj, i) => (
                                                        <li key={i}>
                                                            <strong>MP +{effectObj.Mp}:</strong> {effectObj.detail}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </> :
                                        null}
                                    </li>
                                ))}
                        </ul>
                    </section> :
                null}
                {benefitsArr.length ? 
                    (
                        benefitsArr.length > 1 ? 
                            <section>
                                <h2>Benefits:</h2>
                                <ul>
                                    {benefitsArr.map((benefit, i) => (
                                        <li key={i}>
                                            {benefit.text}
                                        </li>
                                    ))}
                                </ul>
                            </section> :
                            <section>
                                <h2>Benefit:</h2>
                                {benefitsArr.map((benefit) => (
                                    <p key={0}>{benefit.text}</p>
                                ))}
                            </section>
                    ) :
                null}
            </>
        );
    }

    const previewTalent = (data) => {
        return(
            <>
                <header>
                    <h1>{data.name}</h1>
                    <h2 className="subtitle">
                        {data.tags.length ? 
                            <>
                                [
                                {data.tags.map((tag) => (tag)).join("] [")}
                                ]
                            </> :
                            null 
                        } Talent</h2>
                    <p className="prereqs"><strong>Prerequisites:</strong> {data.prereqs}</p>
                </header>
                {data.expectation ? <p className="prereqs"><strong>Expectation:</strong> {data.expectation}</p> : null}
                <h2>Benefits:</h2>
                <ul>
                    {data.various_bonuses.map((modObj, i) => {
                        if (modObj.type === "Synergy") {
                            return (<li key={i}>
                                Gain a{modObj.skill === "Athletics" ? "n" : null} {modObj.skill}-based
                                synergy bonus to your {getDisplayName(modObj.to)}.
                            </li>);
                        } else if (modObj.num > 0) {
                            return (<li key={i}>
                                Gain a +{modObj.num} {modObj.type} bonus to your {getDisplayName(modObj.to)}
                                {modObj.conditional ? ` (${modObj.condition})` : null}.
                            </li>);
                        } else {
                            return null;
                        }
                    })}
                    {data.attacks.map((attackObj, i) => (
                        <li key={i}>Gain a {attackObj.name} {attackObj.type === "natural_weapon" ? "natural weapon" : `${attackObj.type} attack`} (range {attackObj.range}, 
                            base Impact {attackObj.impact_num_dice}d{attackObj.impact_dice_sides}, {Object.keys(attackObj.damage_type.base)
                                .filter((type) => attackObj.damage_type.base[type]).join("/")} damage, 
                            Peril modifier {`${ifPlus(attackObj.peril_mod)}${attackObj.peril_mod}`}). {attackObj.detail ? `Details: ${attackObj.detail}` : null}
                        </li>
                    ))}
                    {data.standard_actions.map((standardAction, i) => (
                        <li key={i}><em>Standard Action:</em> {standardAction}</li>
                    ))}
                    {data.swift_actions.map((swiftAction, i) => (
                        <li key={i}><em>Swift Action:</em> {swiftAction}</li>
                    ))}
                    {data.opportunity_actions.map((oppAction, i) => (
                        <li key={i}><em>Opportunity Action:</em> {oppAction}</li>
                    ))}
                    {data.free_actions.map((freeAction, i) => (
                        <li key={i}><em>Free Action:</em> {freeAction}</li>
                    ))}
                    {data.benefit_traits.map((trait, i) => (
                        <li key={i}><strong>{trait}:</strong> {traitDescriptions[trait]}</li>
                    ))}
                    {data.passives.filter((passive) => !passive.drawback).map((passive, i) => (
                        <li key={i}>{passive.text}</li>
                    ))}
                    {Object.keys(data.selective_passives).length ?
                        <li> <div>Choose one:</div>
                            <ul>
                                {Object.keys(data.selective_passives).sort().map((option) => (
                                    <li key={option}>
                                        <em>{option}:</em> {data.selective_passives[option]}
                                    </li>
                                ))}
                            </ul>
                        </li> :
                    null}
                    {data.short_rest_actions.map((restAction, i) => (
                        <li key={i}><em>Short Rest:</em> {restAction}</li>
                    ))}
                    {data.extended_rest_actions.map((restAction, i) => (
                        <li key={i}><em>Extended Rest:</em> {restAction}</li>
                    ))}
                </ul>
                {(data.various_bonuses.filter((modObj) => modObj.num && modObj.num < 0).length) ||
                    (data.passives.filter((passive) => passive.drawback).length) ||
                    (data.various_penalties.length) || (data.drawback_traits.length) ?
                    <>
                        <h2>Drawbacks</h2>
                        <ul>
                            {data.various_penalties.map((penalty, i) => (
                                <li key={i}>
                                    Incur a {penalty.num} {penalty.type === "Untyped" ? null : penalty.type} penalty 
                                    to your {getDisplayName(penalty.to)}.
                                </li>
                            ))}
                            {data.various_bonuses.map((modObj, i) => {
                                if (modObj.type !== "Synergy" && modObj.num < 0) {
                                    return (
                                        <li key={i}>
                                            Incur a {modObj.num} {modObj.type === "Untyped" ? null : modObj.type} penalty 
                                            to your {getDisplayName(modObj.to)}.
                                        </li>
                                    );
                                } else {
                                    return null;
                                }
                            })}
                            {data.passives.filter((passive) => passive.drawback).map((passive, i) => (
                                <li key={i}>
                                    {passive.text}
                                </li>
                            ))}
                            {data.drawback_traits.map((trait, i) => (
                                <li key={i}><strong>{trait}:</strong> {traitDescriptions[trait]}</li>
                            ))}
                        </ul>
                    </> :
                null}
                {data.normal ?
                    <>
                        <h2>Normal</h2>
                        <p>{data.normal}</p>
                    </> :
                null}
                {data.special_note ?
                    <>
                        <h2>Special</h2>
                        <p>{data.special_note}</p>
                    </> :
                null}
            </>
        );
    }

    const previewItem = (data) => {
        const grade = `${data.weapon_grade[0].toUpperCase()}${data.weapon_grade.slice(1)}`
        return(
            <>
                <h1>{data.name}</h1>
                <h2 className="subtitle">[{data.tags.join("] [")}] Item</h2>
                <h3>Price {data.price}; Bulk {data.bulk}</h3>
                <h3>Hardness {data.hardness}; Resistance {data.resistance}; Structural 
                    Save {ifPlus(parseInt(data.structural_save))}{data.structural_save}</h3>
                <p>{data.description}</p>
                {data.attacks.length ? 
                    <section>
                        <h2>Attacking</h2>
                        {data.attacks.length ?
                            <h3>{grade} {data.weapon_heft} {data.attacks[0].categories.join("/").replace("MiscWeapon", "Miscellaneous")} Weapon</h3> :
                        null}
                        {data.attacks.map((attackObj, i) => (
                            <p key={i}>{attackObj.name} attack (range {attackObj.range}, 
                                base Impact {attackObj.impact_num_dice}d{attackObj.impact_dice_sides}, {Object.keys(attackObj.damage_type.base)
                                    .filter((damageType) => attackObj.damage_type.base[damageType]).join("/")} damage, 
                                Peril modifier {`${ifPlus(attackObj.peril_mod)}${attackObj.peril_mod}`}).
                            </p>
                        ))}
                        {data.attacks.length ? <p>{data.attacks[0].detail}</p> : null}
                    </section> :
                null}
                {data.various_bonuses.length ?
                    <section>
                        <h2>Benefits</h2>
                        {data.various_bonuses.map((modObj, i) => {
                            if (modObj.type === "Synergy") {
                                return (<p key={i}>
                                    Gain a{modObj.skill === "Athletics" ? "n" : null} {modObj.skill}-based
                                    synergy bonus to your {getDisplayName(modObj.to)}{data.worn_or_wielded ? " while worn/wielded" : ""}.
                                </p>);
                            } else if (modObj.num > 0) {
                                return (<p key={i}>
                                    Gain a +{modObj.num} {modObj.type} bonus to your {getDisplayName(modObj.to)}{data.worn_or_wielded ? " while worn/wielded" : ""}.
                                </p>);
                            } else {
                                return null;
                            }
                        })}
                    </section> :
                null}
                {data.various_penalties.length ?
                    <section>
                        <h2>Drawbacks:</h2>
                        {data.various_penalties.map((penalty, i) => (
                            <p key={i}>
                                Incur a {penalty.num} {penalty.type === "Untyped" ? null : penalty.type} penalty 
                                to your {getDisplayName(penalty.to)}{data.worn_or_wielded ? " while worn/wielded" : ""}.
                            </p>
                        ))}
                        {data.various_bonuses.map((modObj, i) => {
                            if (modObj.type !== "Synergy" && modObj.num < 0) {
                                return (
                                    <p key={i}>
                                        Incur a {modObj.num} {modObj.type === "Untyped" ? null : modObj.type} penalty 
                                        to your {getDisplayName(modObj.to)}{data.worn_or_wielded ? " while worn/wielded" : ""}.
                                    </p>
                                );
                            } else {
                                return null;
                            }
                        })}
                    </section> :
                null}
            </>
        );
    }

    return (
        <div className="library-display" ref={scrollContainer}>
            {state.previewComponent ? state.previewComponent : fillerComponent}
        </div>
    );
}

export default SpecialPreview;