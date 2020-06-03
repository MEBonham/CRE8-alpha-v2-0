import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import MyButton from '../ui/MyButton';
import MyFormButton from '../ui/MyFormButton';
import gc from '../../helpers/GameConstants';
import { ritualDefault } from '../../helpers/Templates';

const BuildLibraryRituals = (props) => {
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
    
    const [augments, setAugments] = useState([]);
    const newAugment = (ev) => {
        setAugments([
            ...augments,
            ""
        ]);
    }
    const [variations, setVariations] = useState([]);
    const newVariation = (ev) => {
        setVariations([
            ...variations,
            ""
        ]);
    }

    const tagDefaults = {};
    gc.ritual_tags.forEach((tag) => {
        tagDefaults[`ritualTag_checkbox_${tag}`] = false;
    });
    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            ...ritualDefault,
            ...tagDefaults
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
                    controlRef.current.setValue(`ritualTag_checkbox_${tag}`, true);
                });
            } else if (key === "augments") {
                setAugments(data[key]);
            } else if (key === "variations") {
                setVariations(data[key]);
            } else {
                controlRef.current.setValue(key, data[key]);
            }
        });
    }, []);

    const saveRitual = async (newSlug, ritualObj) => {
        try {
            await db.collection("rituals").doc(newSlug).set({
                ...ritualDefault,
                ...ritualObj
            });
            if (props.editing) {
                fillFormWithPrevInfo(ritualObj);
            } else {
                reset();
                setAugments([]);
                setVariations([]);
            }
        } catch(err) {
            console.log("Error:", err);
        }
    }
    const processRitualForm = (formData) => {
        // console.log(formData);
        const newSlug = encodeURIComponent(formData.name.split(" ").join("").toLowerCase().replace(/'/g, ""));
        const ritualObj = {};
        Object.keys(formData).forEach((key) => {
            if (!key.startsWith("ritualTag")) {
                ritualObj[key] = formData[key];
            }
        })
        ritualObj.tags = gc.ritual_tags.filter((tagName) => {
            const idString = `ritualTag_checkbox_${tagName}`;
            return formData[idString] ? true : false;
        });
        saveRitual(newSlug, ritualObj);
    }

    const [code404, setCode404] = useState(false);
    useEffect(() => {
        const loadDbRituals = async (pageUrl) => {
            try {
                const doc = await db.collection("rituals").doc(pageUrl).get();
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
            loadDbRituals(slug);
        }
    }, [db, fillFormWithPrevInfo, slug, props.editing])

    if (props.editing && !slug) return <Redirect to="/library/rituals" />;
    if (code404) return <Redirect to="/library/rituals" />;
    if (state.user && state.user.rank === "peasant") return <Redirect to="/library/rituals" />;
    return (
        <form onSubmit={handleSubmit(processRitualForm)} className="build-library build-ritual">
            <header className="columns">
                <div className="rows main-body">
                    {props.editing ? <h2>Edit Ritual</h2> : <h2>New Ritual</h2>}
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
                        <h3>Ritual Level</h3>
                        <Controller
                            as="input"
                            type="number"
                            rules={{required: true}}
                            name="ritual_level"
                            control={control}
                        />
                    </div>
                    <div className="checkbox-pair">
                        <Controller
                            as="input"
                            type="checkbox"
                            name="copyable"
                            control={control}
                        />
                        <label>Copyable</label>
                    </div>
                    <div className="rows">
                        <h3>Base MP Cost</h3>
                        <Controller
                            as="input"
                            type="number"
                            rules={{required: true}}
                            name="base_mp_cost"
                            control={control}
                        />
                    </div>
                    <div className="rows">
                        <h3>Component Cost</h3>
                        <Controller
                            as="input"
                            type="number"
                            rules={{required: true}}
                            name="component_cost"
                            control={control}
                        />
                    </div>
                    <div className="rows">
                        <h3>Casting Time</h3>
                        <Controller
                            as="input"
                            type="text"
                            rules={{required: true}}
                            name="casting_time"
                            control={control}
                        />
                    </div>
                </div>
                <div className="right-column">
                    <h3>Tags</h3>
                    <ul>
                        {gc.ritual_tags.map((tag) => (
                            <li key={tag} className="checkbox-pair">
                                <Controller
                                    as="input"
                                    type="checkbox"
                                    name={`ritualTag_checkbox_${tag}`}
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
                    <div className="rows">
                        <label>Effect</label>
                        <Controller
                            as="textarea"
                            control={control}
                            rules={{required: true}}
                            name="effect"
                            rows="3"
                            cols="44"
                        />
                    </div>
                    <section className="brown-box rows">
                        <label>Augmentations</label>
                        {augments.map((augment, i) => (
                            <Controller
                                key={i}
                                as="textarea"
                                control={control}
                                name={`augments[${i}]`}
                                defaultValue={augment}
                                rows="3"
                                cols="44"
                            />
                        ))}
                        <MyButton fct={newAugment}>Add Augmentation</MyButton>
                    </section>
                    <section className="brown-box rows">
                        <label>Variations</label>
                        {variations.map((variation, i) => (
                            <Controller
                                key={i}
                                as="textarea"
                                control={control}
                                name={`variations[${i}]`}
                                defaultValue={variation}
                                rows="3"
                                cols="44"
                            />
                        ))}
                        <MyButton fct={newVariation}>Add Variation</MyButton>
                    </section>
                </div>
            </section>
            <MyFormButton type="submit">Save</MyFormButton>
        </form>
    );
}

export default BuildLibraryRituals;