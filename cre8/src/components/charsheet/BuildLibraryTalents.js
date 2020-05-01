import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import fb from '../../fbConfig';
import MyButton from '../ui/MyButton';
import MyFormButton from '../ui/MyFormButton';
import gc from '../../helpers/GameConstants';
import { talentDefault } from '../../helpers/Templates';
import { arraysEqual } from '../../helpers/Utilities';

const BuildLibraryTalents = (props) => {

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

    const tagDefaults = {};
    gc.talent_tags.forEach((tag) => {
        tagDefaults[`talentTag_checkbox_${tag}`] = false;
    })
    const { control, handleSubmit, register, reset, watch } = useForm({
        defaultValues: {
            ...talentDefault,
            ...tagDefaults
        }
    });

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
            await fb.db.collection("talents").doc(newSlug).set({
                ...talentDefault,
                ...talentObj
            });
            if (props.editing) {
                // fillFormWithPrevInfo(talentObj);
            } else {
                reset();
                setVariousBonuses([]);
                setPassives([]);
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
        const newSlug = encodeURIComponent(formData.name.split(" ").join("").toLowerCase());
        const talentObj = {};
        Object.keys(formData).forEach((key) => {
            if (!key.startsWith("talentTag") && !key.startsWith("variousBonus")) {
                talentObj[key] = formData[key];
            }
        })
        talentObj.tags = gc.talent_tags.filter((tagName) => {
            const idString = `talentTag_checkbox_${tagName}`;
            return formData[idString] ? true : false;
        });
        talentObj.various_bonuses = bundleVariousBonuses(formData);
        // console.log(talentObj);
        saveTalent(newSlug, talentObj);
    }

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
                <div className="main-body">
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
                    </section>
                </div>
            </section>
            <MyFormButton type="submit">Save</MyFormButton>
        </form>
    );
}

export default BuildLibraryTalents;