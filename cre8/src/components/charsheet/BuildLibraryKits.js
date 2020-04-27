import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import gc from '../../helpers/GameConstants';
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
    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            name: "",
            prereqs: "",
            fighting_level_boost: false,
            caster_level_boost: false,
            coast_number_boost: false,
            ...tagDefaults
        }
    });

    const fillFormWithPrevInfo = useCallback((data) => {
        control.setValue("name", data.name);
        control.setValue("prereqs", data.prereqs);
        data.tags.forEach((tag) => {
            control.setValue(`kitTag_checkbox_${tag}`, true);
        });
    }, [control]);

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
        const kitObj = {
            name: formData.name,
            prereqs: formData.prereqs,
            tags: gc.kit_tags.filter((tagName) => {
                const idString = `kitTag_checkbox_${tagName}`;
                return formData[idString] ? true : false;
            })
        }
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
            <div className="columns space-between">
                <div className="rows">
                    {props.editing ? <h2>Edit Kit</h2> : <h2>New Kit</h2>}
                    <div className="rows">
                        <label htmlFor="name">Name</label>
                        <Controller
                            as="input"
                            type="text"
                            rules={{required: true}}
                            name="name"
                            control={control}
                        />
                    </div>
                    <div className="rows">
                        <label htmlFor="prereqs">Prerequisites</label>
                        <Controller
                            as="textarea"
                            name="prereqs"
                            control={control}
                            rows="3"
                            cols="60"
                        />
                    </div>
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
                    <MyFormButton type="submit">Save</MyFormButton>
                </div>
                <div>
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
            </div>
        </form>
    );
  }

export default BuildLibraryKits;