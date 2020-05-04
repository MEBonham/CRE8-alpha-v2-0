import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import MyButton from '../ui/MyButton';
import MyFormButton from '../ui/MyFormButton';
import gc from '../../helpers/GameConstants';
import { talentDefault } from '../../helpers/Templates';
import { arraysEqual } from '../../helpers/Utilities';

const BuildLibraryTalents = (props) => {
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
    const [passives, setPassives] = useState([]);
    const newPassive = (ev) => {
        setPassives([
            ...passives,
            ""
        ]);
    }
    const [selectivePassives, setSelectivePassives] = useState([]);
    const newSelectivePassive = (ev) => {
        setSelectivePassives([
            ...selectivePassives,
            {
                name: "",
                detail: ""
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
    gc.talent_tags.forEach((tag) => {
        tagDefaults[`talentTag_checkbox_${tag}`] = false;
    });
    const selectiveNames = selectivePassives.map((selection) => (
        selection.name
    ));
    const selectiveDetails = selectivePassives.map((selection) => (
        selection.detail
    ));
    const { control, handleSubmit, register, reset, watch } = useForm({
        defaultValues: {
            ...talentDefault,
            ...tagDefaults,
            talent_checkbox_repeatable: talentDefault.can_repeat,
            selectivePassiveName: selectiveNames,
            selectivePassiveDetail: selectiveDetails
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
                    controlRef.current.setValue(`talentTag_checkbox_${tag}`, true);
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
            } else if (key === "selective_passives") {
                console.log(data[key]);
                setSelectivePassives(Object.keys(data[key]).sort().map((name) => ({
                    name,
                    detail: data[key][name]
                })));
            } else if (key === "standard_actions") {
                setStandardActions(data[key]);
            } else if (key === "swift_actions") {
                setSwiftActions(data[key]);
            } else if (key === "short_rest_actions") {
                setShortRestActions(data[key]);
            } else if (key === "extended_rest_actions") {
                setExtendedRestActions(data[key]);
            } else if (key === "can_repeat") {
                // console.log(controlRef.current, data[key], document.querySelector(`input[name="talent_checkbox_repeatable"]`));
                controlRef.current.setValue("talent_checkbox_repeatable", data[key]);
                // document.querySelector(`input[name="talent_checkbox_repeatable"]`).value = data[key];
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

    const saveTalent = async (newSlug, talentObj) => {
        try {
            await db.collection("talents").doc(newSlug).set({
                ...talentDefault,
                ...talentObj
            });
            if (props.editing) {
                fillFormWithPrevInfo(talentObj);
            } else {
                reset();
                setVariousBonuses([]);
                setPassives([]);
                setSelectivePassives([]);
                setStandardActions([]);
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
    const processTalentForm = (formData) => {
        // console.log(formData);
        const newSlug = encodeURIComponent(formData.name.split(" ").join("").toLowerCase());
        const talentObj = {};
        Object.keys(formData).forEach((key) => {
            if (key === "talent_checkbox_repeatable") {
                talentObj.can_repeat = formData[key];
            } else if (key === "selectivePassivesName") {
                talentObj.selective_passives = {};
                formData[key].forEach((name, i) => {
                    talentObj.selective_passives[name] = formData.selectivePassivesDetail[i]
                });
            } else if (!key.startsWith("talentTag") && !key.startsWith("variousBonus") &&
                !key.startsWith("selectivePassive")) {
                talentObj[key] = formData[key];
            }
        })
        talentObj.tags = gc.talent_tags.filter((tagName) => {
            const idString = `talentTag_checkbox_${tagName}`;
            return formData[idString] ? true : false;
        });
        talentObj.various_bonuses = bundleVariousBonuses(formData);
        saveTalent(newSlug, talentObj);
    }

    const [code404, setCode404] = useState(false);
    useEffect(() => {
        const loadDbTalents = async (pageUrl) => {
            try {
                const doc = await db.collection("talents").doc(pageUrl).get();
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
            loadDbTalents(slug);
        }
    }, [db, fillFormWithPrevInfo, slug, props.editing])

    if (props.editing && !slug) return <Redirect to="/library/talents" />;
    if (code404) return <Redirect to="/library/talents" />;
    if (state.user && state.user.rank === "peasant") return <Redirect to="/library/talents" />;
    return (
        <form onSubmit={handleSubmit(processTalentForm)} className="build-library build-talent">
            <header className="columns">
                <div className="rows main-body">
                    {props.editing ? <h2>Edit Talent</h2> : <h2>New Talent</h2>}
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
                </div>
                <div className="right-column">
                    <h3>Tags</h3>
                    <ul>
                        {gc.talent_tags.map((tag) => (
                            <li key={tag} className="checkbox-pair">
                                <Controller
                                    as="input"
                                    type="checkbox"
                                    name={`talentTag_checkbox_${tag}`}
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
                    <section className="selective-passives rows">
                        <label>Selective Passive Abilities</label>
                        <div className="checkbox-pair">
                                <Controller
                                    as="input"
                                    type="checkbox"
                                    name={`talent_checkbox_repeatable`}
                                    control={control}
                                    valueName="checked"
                                />
                                <label>Can take more than once with differing selections</label>
                        </div>
                        {selectivePassives.map((ability, i) => (
                            <div key={i} className="rows">
                                <Controller
                                    as="input"
                                    type="text"
                                    control={control}
                                    name={`selectivePassivesName[${i}]`}
                                    defaultValue={ability.name}
                                />
                                <Controller
                                    as="textarea"
                                    control={control}
                                    name={`selectivePassivesDetail[${i}]`}
                                    defaultValue={ability.detail}
                                    rows="3"
                                    cols="44"
                                />
                            </div>
                        ))}
                        <MyButton fct={newSelectivePassive}>Add Selective-Passive Pair</MyButton>
                    </section>
                    <section className="standard-actions rows">
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
                    <section className="swift-actions rows">
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
                    <section className="short-rest-actions rows">
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
                    <section className="extended-rest-actions rows">
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

export default BuildLibraryTalents;