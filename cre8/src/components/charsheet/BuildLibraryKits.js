import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import gc from '../../helpers/GameConstants';
import { kitDefault } from '../../helpers/Templates';
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
    const { control, handleSubmit, register, reset, setValue } = useForm({
        defaultValues: {
            ...kitDefault,
            ...tagDefaults
        }
    });
    const vp_boost_arr = ["0", "1", "2", "3", "4", "5", "6"];
    const [bonusTalents, setBonusTalents] = useState([]);

    const newBonusTalent = (ev) => {
        setBonusTalents([
            ...bonusTalents,
            {
                byTag: []
            }
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
            } else {
                controlRef.current.setValue(key, data[key]);
            }
        });
    }, [setValue]);

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
            } else if (!key.startsWith("kitTag")) {
                kitObj[key] = formData[key];
            }
        })
        kitObj.bonus_talents = bonusTalentsArr;
        kitObj.tags = gc.kit_tags.filter((tagName) => {
            const idString = `kitTag_checkbox_${tagName}`;
            return formData[idString] ? true : false;
        });
        saveKit(newSlug, kitObj);
    }

    const [code404, setCode404] = useState(false);
    useEffect(() => {
        console.log("Here");
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
                <h3>Bonus Talents</h3>
                {bonusTalents.map((talentData, i) => (
                    <div key={i}>
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
                <MyButton fct={newBonusTalent}>Add Bonus Talent</MyButton>
            </section>
            <MyFormButton type="submit">Save</MyFormButton>
        </form>
    );
  }

export default BuildLibraryKits;