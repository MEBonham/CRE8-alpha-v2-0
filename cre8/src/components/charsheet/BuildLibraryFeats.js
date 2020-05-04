import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import MyButton from '../ui/MyButton';
import MyFormButton from '../ui/MyFormButton';
import gc from '../../helpers/GameConstants';
import { featDefault } from '../../helpers/Templates';
import { arraysEqual } from '../../helpers/Utilities';

const BuildLibraryFeats = (props) => {
    const [state] = useContext(Store);
    const { slug } = useParams();
    const db = fb.db;

    // Protect against memory leak
    const _isMounted = useRef(false);
    useEffect(() => {
        _isMounted.current = true;
        return(() => {
            _isMounted.current = false;
        });
    }, [])

    const [variousBonuses, setVariousBonuses] = useState([]);
    const newVBonus = (ev) => {
        setVariousBonuses([
            ...variousBonuses,
            {
                type: "Untyped",
                num: 1,
                to: "fortitude_mods"
            }
        ]);
    }
    const [freeActions, setFreeActions] = useState([]);
    const newFree = (ev) => {
        setFreeActions([
            ...freeActions,
            ""
        ]);
    }
    const [moveActions, setMoveActions] = useState([]);
    const newMove = (ev) => {
        setMoveActions([
            ...moveActions,
            ""
        ]);
    }
    const [opportunityActions, setOpportunityActions] = useState([]);
    const newOpportunity = (ev) => {
        setOpportunityActions([
            ...opportunityActions,
            ""
        ]);
    }
    const [passives, setPassives] = useState([]);
    const newPassive = (ev) => {
        setPassives([
            ...passives,
            ""
        ]);
    }
    const [augmentOptions, setAugmentOptions] = useState([]);
    const newAugmentOption = (ev) => {
        setAugmentOptions([
            ...augmentOptions,
            {
                Mp: "1",
                detail: "",
                cumulative: false
            }
        ]);
    }
    const [seedEffects, setSeedEffects] = useState([]);
    const newSeedEffect = (ev) => {
        setSeedEffects([
            ...seedEffects,
            {
                seed: "",
                Mp: "0",
                detail: "",
                cumulative: false
            }
        ]);
    }
    const [standardActions, setStandardActions] = useState([]);
    const newStandard = (ev) => {
        setStandardActions([
            ...standardActions,
            ""
        ]);
    }
    const [swiftActions, setSwiftActions] = useState([]);
    const newSwift = (ev) => {
        setSwiftActions([
            ...swiftActions,
            ""
        ]);
    }
    const [shortRestActions, setShortRestActions] = useState([]);
    const newShortRestAction = (ev) => {
        setShortRestActions([
            ...shortRestActions,
            ""
        ]);
    }
    const [extendedRestActions, setExtendedRestActions] = useState([]);
    const newExtendedRestAction = (ev) => {
        setExtendedRestActions([
            ...extendedRestActions,
            ""
        ]);
    }

    const tagDefaults = {};
    gc.feat_tags.forEach((tag) => {
        tagDefaults[`featTag_checkbox_${tag}`] = false;
    });
    const cumulativeDefaults = {};
    for (let i = 0; i < seedEffects.length; i++) {
        cumulativeDefaults[`seedEffectCumulative_${i}`] = false;
    }
    for (let i = 0; i < augmentOptions.length; i++) {
        cumulativeDefaults[`augmentCumulative_${i}`] = false;
    }
    const augmentMpCost = augmentOptions.map((option) => (
        option.Mp
    ));
    const augmentDetail = augmentOptions.map((option) => (
        option.detail
    ));
    const seedEffectMpCost = seedEffects.map((effect) => (
        effect.Mp
    ));
    const seedEffectDetail = seedEffects.map((effect) => (
        effect.detail
    ));
    const seedEffectSeed = seedEffects.map((effect) => (
        effect.seed
    ));
    // const seedEffectCumulative = seedEffects.map((effect) => (
    //     effect.cumulative
    // ));
    const { control, handleSubmit, register, reset, watch } = useForm({
        defaultValues: {
            ...featDefault,
            ...tagDefaults,
            ...cumulativeDefaults,
            feat_checkbox_repeatable: featDefault.can_repeat,
            augmentMp: augmentMpCost,
            augmentDetail: augmentDetail,
            seedEffectSeed,
            seedEffectMpCost,
            seedEffectDetail,
            // seedEffectCumulative
        }
    });

    const controlRef = useRef(null);
    useEffect(() => {
        controlRef.current = control;
    }, [control])
    const fillFormWithPrevInfo = useCallback((data) => {
        // console.log(controlRef.current);
        Object.keys(data).forEach((key) => {
            if (key === "tags") {
                data[key].forEach((tag) => {
                    controlRef.current.setValue(`featTag_checkbox_${tag}`, true);
                });
            } else if (key === "various_bonuses") {
                setVariousBonuses(data[key].map((bonus) => {
                    const bonusObj = {};
                    bonusObj.type = bonus.type || "Untyped";
                    bonusObj.to = bonus.to || "fortitude_mods";
                    bonusObj.num = bonus.num || 1;
                    bonusObj.skill = bonus.skill || "Brawn";
                    return bonusObj;
                }));
            } else if (key === "passives") {
                setPassives(data[key]);
            } else if (key === "augment_options") {
                setAugmentOptions(data[key].map((augmentObj) => ({
                    Mp: augmentObj.Mp,
                    detail: augmentObj.detail,
                    cumulative: augmentObj.cumulative
                })));
            } else if (key === "seed_effects") {
                setSeedEffects(data[key].map((effectObj) => ({
                    seed: effectObj.seed,
                    Mp: effectObj.Mp,
                    detail: effectObj.detail,
                    cumulative: effectObj.cumulative
                })));
            } else if (key === "standard_actions") {
                setStandardActions(data[key]);
            } else if (key === "move_actions") {
                setMoveActions(data[key]);
            } else if (key === "opportunity_actions") {
                setOpportunityActions(data[key]);
            } else if (key === "free_actions") {
                setFreeActions(data[key]);
            } else if (key === "swift_actions") {
                setSwiftActions(data[key]);
            } else if (key === "short_rest_actions") {
                setShortRestActions(data[key]);
            } else if (key === "extended_rest_actions") {
                setExtendedRestActions(data[key]);
            } else if (key === "can_repeat") {
                // console.log(controlRef.current, data[key], document.querySelector(`input[name="feat_checkbox_repeatable"]`));
                controlRef.current.setValue("feat_checkbox_repeatable", data[key]);
                // document.querySelector(`input[name="feat_checkbox_repeatable"]`).value = data[key];
            } else if (key === "benefit_traits" || key === "drawback_traits") {
                const els = document.querySelectorAll(`select[name="${key}"] option`);
                els.forEach((option) => {
                    option.selected = data[key].includes(option.value);
                });
            } else {
                controlRef.current.setValue(key, data[key]);
            }
        });
    }, []);

    const [variousBonusTypes, setVariousBonusTypes] = useState([]);
    useEffect(() => {
        if (watch("variousBonusType") && !arraysEqual(watch("variousBonusType"), variousBonusTypes)) {
            setVariousBonusTypes(watch("variousBonusType"));
        }
    }, [variousBonuses, variousBonusTypes, watch])
    const updateBonusType = (ev) => {
        if (watch("variousBonusType")) {
            setVariousBonusTypes(watch("variousBonusType"));
        }
    }

    const saveFeat = async (newSlug, featObj) => {
        try {
            await db.collection("feats").doc(newSlug).set({
                ...featDefault,
                ...featObj
            });
            if (props.editing) {
                fillFormWithPrevInfo(featObj);
            } else {
                reset();
                setVariousBonuses([]);
                setPassives([]);
                setAugmentOptions([]);
                setSeedEffects([]);
                setStandardActions([]);
                setMoveActions([]);
                setOpportunityActions([]);
                setFreeActions([]);
                setSwiftActions([]);
                setShortRestActions([]);
                setExtendedRestActions([]);
            }
        } catch(err) {
            console.log("Error:", err);
        }
    }
    
    const bundleVariousBonuses = (data) => {
        const arr = [];
        if (data.variousBonusTo) {
            for (let i = 0; i < data.variousBonusTo.length; i++) {
                if (data.variousBonusType[i] === "Select" || data.variousBonusTo[i] === "Select") continue;
                const bonusObj = {};
                bonusObj.type = data.variousBonusType[i];
                bonusObj.to = data.variousBonusTo[i];
                if (data.variousBonusType[i] === "Synergy") {
                    bonusObj.skill = data.variousBonusSkill[i];
                } else {
                    bonusObj.num = parseInt(data.variousBonusNum[i]);
                }
                arr.push(bonusObj);
            }
        }
        return arr;
    }
    const processFeatForm = (formData) => {
        const newSlug = encodeURIComponent(formData.name.split(" ").join("").toLowerCase());
        const featObj = {};
        Object.keys(formData).forEach((key) => {
            if (key === "feat_checkbox_repeatable") {
                featObj.can_repeat = formData[key];
            } else if (key === "augmentDetail") {
                featObj.augment_options = [];
                formData[key].forEach((detail, i) => {
                    featObj.augment_options.push({
                        detail,
                        Mp: formData.augmentMpCost[i],
                        cumulative: formData[`augmentCumulative_${i}`]
                    });
                });
            } else if (key === "seedEffectDetail") {
                featObj.seed_effects = [];
                formData[key].forEach((detail, i) => {
                    featObj.seed_effects.push({
                        seed: formData.seedEffectSeed[i],
                        detail,
                        Mp: formData.seedEffectMpCost[i],
                        // cumulative: formData.seedEffectCumulative[i]
                        cumulative: formData[`seedEffectCumulative_${i}`]
                    });
                });
            } else if (!key.startsWith("featTag") && !key.startsWith("variousBonus") &&
                !key.startsWith("augment") && !key.startsWith("seedEffect")) {
                featObj[key] = formData[key];
            }
        })
        featObj.tags = gc.feat_tags.filter((tagName) => {
            const idString = `featTag_checkbox_${tagName}`;
            return formData[idString] ? true : false;
        });
        featObj.various_bonuses = bundleVariousBonuses(formData);
        saveFeat(newSlug, featObj);
    }

    const [code404, setCode404] = useState(false);
    useEffect(() => {
        const loadDbFeats = async (pageUrl) => {
            try {
                const doc = await db.collection("feats").doc(pageUrl).get();
                if (doc.exists) {
                    fillFormWithPrevInfo(doc.data());
                } else {
                    if (_isMounted.current) {
                        setCode404(true);
                    }
                }
            } catch(err) {
                console.log("Error:", err);
            }
        }
        if (props.editing) {
            loadDbFeats(slug);
        }
    }, [db, fillFormWithPrevInfo, slug, props.editing])

    if (props.editing && !slug) return <Redirect to="/library/feats" />;
    if (code404) return <Redirect to="/library/feats" />;
    if (state.user && state.user.rank === "peasant") return <Redirect to="/library/feats" />;
    return (
        <form onSubmit={handleSubmit(processFeatForm)} className="build-library build-feat">
            <header className="columns">
                <div className="rows main-body">
                    {props.editing ? <h2>Edit Feat</h2> : <h2>New Feat</h2>}
                    <div className="rows">
                        <h3>Name</h3>
                        <Controller
                            as="input"
                            type="text"
                            rules={{required: true}}
                            name="name"
                            control={control}
                        />
                    </div>
                    <div className="rows">
                        <h3>Prerequisites</h3>
                        <Controller
                            as="textarea"
                            name="prereqs"
                            control={control}
                            rows="3"
                            cols="54"
                        />
                    </div>
                    <div className="rows">
                        <h3>Applicable Spell Seeds</h3>
                        <Controller
                            as="input"
                            type="text"
                            name="applicable_seeds"
                            control={control}
                        />
                    </div>
                </div>
                <div className="right-column">
                    <h3>Tags</h3>
                    <ul>
                        {gc.feat_tags.map((tag) => (
                            <li key={tag} className="checkbox-pair">
                                <Controller
                                    as="input"
                                    type="checkbox"
                                    name={`featTag_checkbox_${tag}`}
                                    control={control}
                                    valueName="checked"
                                />
                                <label>{tag}</label>
                            </li>
                        ))}
                    </ul>
                </div>
            </header>
            <section className="columns">
                <div className="main-body rows">
                    <section className="various-bonuses rows">
                        <label>Various Bonuses</label>
                        <ul>
                            {variousBonuses.map((bonus, i) => (
                                <li key={`${i}`}>
                                    <input
                                        type="number"
                                        defaultValue={bonus.num}
                                        ref={register}
                                        name={`variousBonusNum[${i}]`}
                                        className="small"
                                        disabled={variousBonusTypes.length > i && variousBonusTypes[i] === "Synergy"}
                                    />
                                    <select
                                        name={`variousBonusType[${i}]`}
                                        ref={register}
                                        defaultValue={bonus.type}
                                        onChange={updateBonusType}
                                    >
                                        <option value={"Select"}>Select</option>
                                        {gc.bonus_types.map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                    <label>bonus to</label>
                                    <select
                                        name={`variousBonusTo[${i}]`}
                                        defaultValue={bonus.to}
                                        ref={register}
                                    >
                                        <option value={"Select"}>Select</option>
                                        {gc.bonus_targets.map((stat) => (
                                            <option key={stat.code} value={stat.code}>{stat.name}</option>
                                        ))}
                                    </select>
                                    {variousBonusTypes.length > i && variousBonusTypes[i] === "Synergy" ?
                                    <>
                                        <label>(</label>
                                        <select
                                            name={`variousBonusSkill[${i}]`}
                                            defaultValue={bonus.skill}
                                            ref={register}
                                        >
                                            {gc.skills_list.map((skill) => (
                                                <option key={skill} value={skill}>{skill}</option>
                                            ))}
                                        </select>
                                        <label>)</label>
                                    </> :
                                    null}
                                </li>
                            ))}
                        </ul>
                        <MyButton fct={newVBonus}>Add Bonus</MyButton>
                    </section>
                    <section className="standard-actions brown-box rows">
                        <label>Standard Actions</label>
                        {standardActions.map((action, i) => (
                            <Controller
                                key={i}
                                as="textarea"
                                control={control}
                                name={`standard_actions[${i}]`}
                                defaultValue={action}
                                rows="3"
                                cols="44"
                            />
                        ))}
                        <MyButton fct={newStandard}>Add Standard Action</MyButton>
                    </section>
                    <section className="move-actions brown-box rows">
                        <label>Move Actions</label>
                        {moveActions.map((action, i) => (
                            <Controller
                                key={i}
                                as="textarea"
                                control={control}
                                name={`move_actions[${i}]`}
                                defaultValue={action}
                                rows="3"
                                cols="44"
                            />
                        ))}
                        <MyButton fct={newMove}>Add Move Action</MyButton>
                    </section>
                    <section className="swift-actions brown-box rows">
                        <label>Swift Actions</label>
                        {swiftActions.map((action, i) => (
                            <Controller
                                key={i}
                                as="textarea"
                                control={control}
                                name={`swift_actions[${i}]`}
                                defaultValue={action}
                                rows="3"
                                cols="44"
                            />
                        ))}
                        <MyButton fct={newSwift}>Add Swift Action</MyButton>
                    </section>
                    <section className="opportunity-actions brown-box rows">
                        <label>Opportunity Actions</label>
                        {opportunityActions.map((action, i) => (
                            <Controller
                                key={i}
                                as="textarea"
                                control={control}
                                name={`opportunity_actions[${i}]`}
                                defaultValue={action}
                                rows="3"
                                cols="44"
                            />
                        ))}
                        <MyButton fct={newOpportunity}>Add Opportunity Action</MyButton>
                    </section>
                    <section className="free-actions brown-box rows">
                        <label>Free Actions</label>
                        {freeActions.map((action, i) => (
                            <Controller
                                key={i}
                                as="textarea"
                                control={control}
                                name={`free_actions[${i}]`}
                                defaultValue={action}
                                rows="3"
                                cols="44"
                            />
                        ))}
                        <MyButton fct={newFree}>Add Free Action</MyButton>
                    </section>
                    <section className="passives rows">
                        <label>Passive Abilities</label>
                        {passives.map((ability, i) => (
                            <Controller
                                key={i}
                                as="textarea"
                                control={control}
                                name={`passives[${i}]`}
                                defaultValue={ability}
                                rows="3"
                                cols="44"
                            />
                        ))}
                        <MyButton fct={newPassive}>Add Passive Ability</MyButton>
                    </section>
                    <section className="short-rest-actions brown-box rows">
                        <label>Short Rest Actions</label>
                        {shortRestActions.map((action, i) => (
                            <Controller
                                key={i}
                                as="textarea"
                                control={control}
                                name={`short_rest_actions[${i}]`}
                                defaultValue={action}
                                rows="3"
                                cols="44"
                            />
                        ))}
                        <MyButton fct={newShortRestAction}>Add Short Rest Action</MyButton>
                    </section>
                    <section className="extended-rest-actions brown-box rows">
                        <label>Extended Rest Actions</label>
                        {extendedRestActions.map((action, i) => (
                            <Controller
                                key={i}
                                as="textarea"
                                control={control}
                                name={`extended_rest_actions[${i}]`}
                                defaultValue={action}
                                rows="3"
                                cols="44"
                            />
                        ))}
                        <MyButton fct={newExtendedRestAction}>Add Extended Rest Action</MyButton>
                    </section>
                    <section className="augment-options brown-box rows">
                        <label>Spell Augment Options</label>
                        {augmentOptions.map((option, i) => (
                            <div key={i} className="rows">
                                <div>
                                    <label>Extra MP Cost:</label>
                                    <Controller
                                        as="input"
                                        type="number"
                                        control={control}
                                        name={`augmentMpCost[${i}]`}
                                        defaultValue={option.Mp}
                                    />
                                </div>
                                <div className="checkbox-pair">
                                    <Controller
                                        as="input"
                                        type="checkbox"
                                        name={`augmentCumulative_${i}`}
                                        control={control}
                                        valueName="checked"
                                        defaultValue={option.cumulative}
                                    />
                                    <label>Cumulative</label>
                                </div>
                                <Controller
                                    as="textarea"
                                    control={control}
                                    name={`augmentDetail[${i}]`}
                                    defaultValue={option.detail}
                                    placeholder="Effect"
                                    rows="3"
                                    cols="44"
                                />
                            </div>
                        ))}
                        <MyButton fct={newAugmentOption}>Add Spell Augment Option</MyButton>
                    </section>
                    <section className="seed-effects brown-box rows">
                        <label>Spell Seed Effects</label>
                        {seedEffects.map((effect, i) => (
                            <div key={i} className="rows">
                                <div>
                                    <label>Seed:</label>
                                    <Controller
                                        as="input"
                                        type="text"
                                        control={control}
                                        name={`seedEffectSeed[${i}]`}
                                        defaultValue={effect.seed}
                                    />
                                </div>
                                <div>
                                    <label>Extra MP Cost:</label>
                                    <Controller
                                        as="input"
                                        type="number"
                                        control={control}
                                        name={`seedEffectMpCost[${i}]`}
                                        defaultValue={effect.Mp}
                                    />
                                </div>
                                <div className="checkbox-pair">
                                    <Controller
                                        as="input"
                                        type="checkbox"
                                        name={`seedEffectCumulative_${i}`}
                                        control={control}
                                        valueName="checked"
                                        defaultValue={effect.cumulative}
                                    />
                                    <label>Cumulative</label>
                                </div>
                                <Controller
                                    as="textarea"
                                    control={control}
                                    name={`seedEffectDetail[${i}]`}
                                    defaultValue={effect.detail}
                                    placeholder="Effect"
                                    rows="3"
                                    cols="44"
                                />
                            </div>
                        ))}
                        <MyButton fct={newSeedEffect}>Add Spell Seed Effect</MyButton>
                    </section>
                    <div className="rows">
                        <h3>Normal</h3>
                        <Controller
                            as="textarea"
                            name="normal"
                            control={control}
                            rows="3"
                            cols="54"
                        />
                    </div>
                </div>
                <div className="rows right-column">
                    <label>Intended Minimum Level</label>
                    <Controller
                        as="input"
                        type="number"
                        rules={{required: true}}
                        name="intended_level"
                        control={control}
                    />
                </div>
            </section>
            <MyFormButton type="submit">Save</MyFormButton>
        </form>
    );
}

export default BuildLibraryFeats;