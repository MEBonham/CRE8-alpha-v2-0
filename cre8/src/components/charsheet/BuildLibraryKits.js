import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import gc from '../../helpers/GameConstants';
import { kitDefault } from '../../helpers/Templates';
import { arraysEqual } from '../../helpers/Utilities';
import MyButton from '../ui/MyButton';
import MyFormButton from '../ui/MyFormButton';

const BuildLibraryKits = (props) => {
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

    const tagDefaults = {};
    gc.kit_tags.forEach((tag) => {
        tagDefaults[`kitTag_checkbox_${tag}`] = false;
    })
    const { control, handleSubmit, register, reset, setValue, watch } = useForm({
        defaultValues: {
            ...kitDefault,
            ...tagDefaults
        }
    });
    const vp_boost_arr = ["0", "1", "2", "3", "4", "5", "6"];
    const [bonusTalents, setBonusTalents] = useState([]);
    const [variousBonuses, setVariousBonuses] = useState([]);
    const [extendedRests, setExtendedRests] = useState([]);

    const newBonusTalent = (ev) => {
        setBonusTalents([
            ...bonusTalents,
            {
                byTag: []
            }
        ]);
    }
    const newVBonus = (ev) => {
        setVariousBonuses([
            ...variousBonuses,
            {
                type: "Untyped",
                num: 1,
                to: "Fortitude"
            }
        ]);
    }
    const newExtendedRest = (ev) => {
        setExtendedRests([
            ...extendedRests,
            ""
        ]);
    }

    const controlRef = useRef(null);
    useEffect(() => {
        controlRef.current = control;
    }, [control])
    const fillFormWithPrevInfo = useCallback((data) => {
        Object.keys(data).forEach((key) => {
            if (key === "tags") {
                data[key].forEach((tag) => {
                    controlRef.current.setValue(`kitTag_checkbox_${tag}`, true);
                });
            } else if (key === "vp_boost") {
                setValue(key, data[key]);
            } else if (key === "bonus_talents") {
                setBonusTalents(data[key]);
            } else if (key === "various_bonuses") {
                setVariousBonuses(data[key].map((bonus) => {
                    const bonusObj = {};
                    bonusObj.type = bonus.type || "Untyped";
                    bonusObj.to = bonus.to || "fortitude_mods";
                    bonusObj.num = bonus.num || 1;
                    bonusObj.skill = bonus.skill || "Brawn";
                    return bonusObj;
                }));
            } else if (key === "extended_rest_actions") {
                setExtendedRests(data[key]);
            } else if (key === "benefit_traits") {
                const els = document.querySelectorAll(`select[name="benefit_traits"] option`);
                els.forEach((option) => {
                    option.selected = data[key].includes(option.value);
                });
            } else {
                controlRef.current.setValue(key, data[key]);
            }
        });
    }, [setValue]);

    useEffect(() => {
        bonusTalents.forEach((talent, i) => {
            const el = document.querySelectorAll(".bonus-talents select")[i];
            gc.talent_tags.forEach((option) => {
                el.querySelector(`option[value="${option}"]`).selected = (talent.byTag.includes(option));
            });
        });
    }, [bonusTalents])

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

    const saveKit = async (newSlug, kitObj) => {
        try {
            await db.collection("kits").doc(newSlug).set(kitObj);
            if (props.editing) {
                fillFormWithPrevInfo(kitObj);
            } else {
                reset();
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
    const processKitForm = (formData) => {
        console.log(formData);
        const newSlug = encodeURIComponent(formData.name.split(" ").join("").toLowerCase());
        const kitObj = {};
        const bonusTalentsArr = [];
        Object.keys(formData).forEach((key) => {
            if (key.startsWith("bonus_talent")) {
                bonusTalentsArr.push({
                    byTag: formData[key]
                });
            } else if (!key.startsWith("kitTag") && !key.startsWith("variousBonus")) {
                kitObj[key] = formData[key];
            }
        })
        kitObj.bonus_talents = bonusTalentsArr;
        kitObj.tags = gc.kit_tags.filter((tagName) => {
            const idString = `kitTag_checkbox_${tagName}`;
            return formData[idString] ? true : false;
        });
        kitObj.various_bonuses = bundleVariousBonuses(formData);
        saveKit(newSlug, kitObj);
    }

    const [code404, setCode404] = useState(false);
    useEffect(() => {
        const loadDbKits = async (pageUrl) => {
            try {
                const doc = await db.collection("kits").doc(pageUrl).get();
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
            loadDbKits(slug);
        }
    }, [db, fillFormWithPrevInfo, slug, props.editing])

    if (props.editing && !slug) return <Redirect to="/library/kits" />;
    if (code404) return <Redirect to="/library/kits" />;
    if (state.user && state.user.rank === "peasant") return <Redirect to="/library/kits" />;
    return (
        <form onSubmit={handleSubmit(processKitForm)} className="build-library">
            <header className="columns">
                <div className="rows main-body">
                    {props.editing ? <h2>Edit Kit</h2> : <h2>New Kit</h2>}
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
                        {gc.kit_tags.map((tag) => (
                            <li key={tag} className="checkbox-pair">
                                <Controller
                                    as="input"
                                    type="checkbox"
                                    name={`kitTag_checkbox_${tag}`}
                                    control={control}
                                />
                                <label>{tag}</label>
                            </li>
                        ))}
                    </ul>
                </div>
            </header>
            <section className="columns">
                <div className="main-body">
                    <h3>Benefits</h3>
                    <ul className="columns">
                        <li className="checkbox-pair">
                            <Controller
                                as="input"
                                type="checkbox"
                                name="fighting_level_boost"
                                control={control}
                            />
                            <label>Fighting Level boost</label>
                        </li>
                        <li className="checkbox-pair">
                            <Controller
                                as="input"
                                type="checkbox"
                                name="caster_level_boost"
                                control={control}
                            />
                            <label>Caster Level boost</label>
                        </li>
                        <li className="checkbox-pair">
                            <Controller
                                as="input"
                                type="checkbox"
                                name="coast_number_boost"
                                control={control}
                            />
                            <label>Coast Number boost</label>
                        </li>
                    </ul>
                    <div className="checkbox-pair">
                        <Controller
                            as="input"
                            type="checkbox"
                            name="fighting_OR_caster_boost"
                            control={control}
                        />
                        <label>Fighting Level <span className="or">or</span> Caster Level boost</label>
                    </div>
                    <div className="checkbox-pair">
                        <Controller
                            as="input"
                            type="checkbox"
                            name="fighting_OR_coast_boost"
                            control={control}
                        />
                        <label>Fighting Level <span className="or">or</span> Coast Number boost</label>
                    </div>
                    <div className="checkbox-pair">
                        <Controller
                            as="input"
                            type="checkbox"
                            name="caster_OR_coast_boost"
                            control={control}
                        />
                        <label>Caster Level <span className="or">or</span> Coast Number boost</label>
                    </div>
                    <section className="various-bonuses rows">
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
                        <p>{JSON.stringify(variousBonusTypes.current)}</p>
                    </section>
                </div>
                <div className="right-column">
                    <label htmlFor="vp_boost">VP Boost</label>
                    <ul>
                        {vp_boost_arr.map((numStr) => (
                            <li key={numStr} className="radio-vp_boost">
                                {/* <Controller
                                    as="input"
                                    type="radio"
                                    name="vp_boost"
                                    id={`meb-editKit-radio-vp_boost-${numStr}`}
                                    value={numStr}
                                    control={control}
                                    defaultChecked={numStr === "0"}
                                /> */}
                                <input
                                    type="radio"
                                    name="vp_boost"
                                    value={numStr}
                                    ref={register}
                                />
                                <label>{numStr}</label>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
            <section className="bonus-talents">
                <label>Bonus Talents</label>
                <div className="columns">
                    {bonusTalents.map((talentData, i) => (
                        <div key={i} className="columns">
                            <label>({i + 1})</label>
                            {/* <Controller
                                as="select"
                                name={`bonus_talent_tags_${i}`}
                                control={control}
                                multiple
                            >
                                {gc.talent_tags.map((tagName) => (
                                    <option key={tagName} value={tagName}>{tagName}</option>
                                ))}
                            </Controller> */}
                            <select
                                name={`bonus_talent_tags_${i}`}
                                ref={register}
                                multiple
                            >
                                {gc.talent_tags.map((tagName) => (
                                    <option key={tagName} value={tagName}>{tagName}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
                <MyButton fct={newBonusTalent}>Add Bonus Talent</MyButton>
            </section>
            <div className="columns">
                <section className="extended-rests rows main-body">
                    <label>Extended Rest Abilities</label>
                    {extendedRests.map((ability, i) => (
                        <Controller
                            key={i}
                            as="textarea"
                            control={control}
                            name={`extended_rest_actions[${i}]`}
                            defaultValue={ability}
                            rows="3"
                            cols="44"
                        />
                    ))}
                    <MyButton fct={newExtendedRest}>Add Extended Rest Ability</MyButton>
                </section>
                <section className="right-column rows">
                    <label>Positive Traits</label>
                    <select
                        name="benefit_traits"
                        ref={register}
                        multiple
                    >
                        {gc.benefit_traits.map((trait) => (
                            <option
                                key={trait}
                                value={trait}
                            >
                                {trait}
                            </option>
                        ))}
                    </select>
                </section>
            </div>
            <MyFormButton type="submit">Save</MyFormButton>
        </form>
    );
  }

export default BuildLibraryKits;