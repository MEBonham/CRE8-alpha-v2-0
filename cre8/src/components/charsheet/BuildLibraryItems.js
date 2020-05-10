import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { Redirect, useParams } from 'react-router-dom';
// import { Controller, useForm } from 'react-hook-form';
// import { Formik, Field, Form, ErrorMessage } from 'formik';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import { itemDefault } from '../../helpers/Templates';
import gc from '../../helpers/GameConstants';
import Form from '../miniFormik/Form';
import Field from '../miniFormik/Field';
import MyFormButton from '../ui/MyFormButton';
import MyButton from '../ui/MyButton';

const BuildLibraryItems = (props) => {
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

    const [attacks, setAttacks] = useState([]);
    const newAttack = (ev) => {
        setAttacks([
            ...attacks,
            {
                name: "",
                type: "weapon",
                range: "Melee reach 1 (medium)",
                detail: "",
                impact_num_dice: 1,
                impact_dice_sides: 6,
                damage_type: {
                    base: {
                        bludgeoning: true
                    }
                },
                perilMod: 2
            }
        ]);
    }

    const tagDefaults = {};
    gc.item_tags.forEach((tag) => {
        tagDefaults[`tag_checkbox_${tag}`] = false;
    });
    const [defaultValues, setDefaultValues] = useState({ ...itemDefault, ...tagDefaults, attacks });
    const tagsRef = useRef(tagDefaults);
    useEffect(() => {
        const attacksObj = {};
        attacks.forEach((attackObj, i) => {
            Object.keys(attackObj).forEach((attackKey) => {
                if (attackKey === "damage_type") {
    
                } else {
                    attacksObj[`attacks.${i}.${attackKey}`] = attackObj[attackKey];
                }
            });
        });
        setDefaultValues({ ...itemDefault, ...tagsRef.current, ...attacksObj });
    }, [attacks])
    
    const fillFormWithPrevInfo = useCallback((data) => {
        const newDefaults = {};
        Object.keys(data).forEach((key) => {
            if (key === "tags") {
                data[key].forEach((trueTag) => {
                    newDefaults[`tag_checkbox_${trueTag}`] = true;
                });
            } else {
                newDefaults[key] = data[key];
            }
        });
        setDefaultValues(newDefaults);
    }, []);

    const saveItem = async (newSlug, itemObj) => {
        try {
            await db.collection("items").doc(newSlug).set({
                ...itemDefault,
                ...itemObj
            });
            if (props.editing) {
                fillFormWithPrevInfo(itemObj);
            } else {
                setAttacks([]);
            }
        } catch(err) {
            console.log("Error:", err);
        }
    }
    const processItemForm = (ev, formData) => {
        console.log(formData);
        const newSlug = encodeURIComponent(formData.name.split(" ").join("").toLowerCase());
        const itemObj = {};
        Object.keys(formData).forEach((key) => {
            if (!key.startsWith("tag")) {
                itemObj[key] = formData[key];
            }
        })
        itemObj.tags = gc.item_tags.filter((tagName) => {
            const idString = `tag_checkbox_${tagName}`;
            return formData[idString] ? true : false;
        });
        saveItem(newSlug, itemObj);
    }

    const [code404, setCode404] = useState(false);
    useEffect(() => {
        const loadDbItems = async (pageUrl) => {
            try {
                const doc = await db.collection("items").doc(pageUrl).get();
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
            loadDbItems(slug);
        }
    }, [db, fillFormWithPrevInfo, slug, props.editing])

    if (props.editing && !slug) return <Redirect to="/library/items" />;
    if (code404) return <Redirect to="/library/items" />;
    if (state.user && state.user.rank === "peasant") return <Redirect to="/library/items" />;
    return (
        <Form
            onSubmit={processItemForm}
            defaultValues={defaultValues}
            reset={!props.editing}
            sections={{ attacks }}
            className="build-items"
        >
            <h1>{props.editing ? "Edit Item" : "New Item"}</h1>
            <div className="columns">
                <div className="main-body rows">
                    <div className="rows">
                        <label htmlFor="name">Name</label>
                        <Field name="name" type="text" required />
                    </div>
                    <div className="rows">
                        <label htmlFor="price">Price</label>
                        <Field name="price" type="number" />
                    </div>
                    <div className="rows">
                        <label htmlFor="bulk">Bulk</label>
                        <Field name="bulk" type="number" />
                    </div>
                    <div className="rows">
                        <label htmlFor="description">Description</label>
                        <Field name="description" as="textarea" rows="4" cols="50" />
                    </div>
                </div>
                <div className="right-column rows">
                    <label>Tags</label>
                    <ul>
                        {gc.item_tags.map((tag) => (
                            <li key={tag} className="checkbox-pair">
                                <Field
                                    type="checkbox"
                                    name={`tag_checkbox_${tag}`}
                                />
                                <label>{tag}</label>
                            </li>
                        ))}
                    </ul>
                </div>
                <section className="attack-form brown-box rows">
                    <h3>Attacks</h3>
                    {attacks.map((attackObj, i) => (
                        <div key={i}>
                            <div className="main-body">
                                <div className="rows">
                                    <label htmlFor={`attacks.${i}.name`}>Name of Attack</label>
                                    <Field name={`attacks.${i}.name`} type="text" required />
                                </div>
                                <div className="rows">
                                    <label htmlFor={`attacks.${i}.type`}>Type</label>
                                    <ul className="radio-bank">
                                        <li>
                                            <Field name={`attacks.${i}.type`} type="radio" radioValue="weapon" />
                                            <label>Weapon attack</label>
                                        </li>
                                        <li>
                                            <Field name={`attacks.${i}.type`} type="radio" radioValue="natural_weapon" />
                                            <label>Natural Weapon attack</label>
                                        </li>
                                        <li>
                                            <Field name={`attacks.${i}.type`} type="radio" radioValue="spell" />
                                            <label>Spell attack</label>
                                        </li>
                                        <li>
                                            <Field name={`attacks.${i}.type`} type="radio" radioValue="vim" />
                                            <label>Vim attack</label>
                                        </li>
                                    </ul>
                                    <div className="rows">
                                        <label htmlFor={`attacks.${i}.range`}>Attack Range(s)</label>
                                        <Field name={`attacks.${i}.range`} type="text" required />
                                    </div>
                                </div>
                            </div>
                            <div className="right-column">

                            </div>
                        </div>
                    ))}
                    <MyButton fct={newAttack}>Add Attached Attack</MyButton>
                </section>
            </div>
            <MyFormButton type="submit">Save</MyFormButton>
        </Form>
    );
}

export default BuildLibraryItems;