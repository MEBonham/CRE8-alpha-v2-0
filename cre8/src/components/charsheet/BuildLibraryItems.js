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

    const tagDefaults = {};
    gc.item_tags.forEach((tag) => {
        tagDefaults[`tag_checkbox_${tag}`] = false;
    });
    const [defaultValues, setDefaultValues] = useState({ ...itemDefault, ...tagDefaults });
    const defaultsRef = useRef(defaultValues);
    // useEffect(() => {
    //     defaultsRef.current = defaultValues;
    //     // console.log(defaultValues);
    // }, [defaultValues])

    const [attacks, setAttacks] = useState([]);
    const newAttack = (ev) => {
        const newestIndex = attacks.length;
        const baseAttackObj = {
            name: "",
            categories: [ "Light Blade" ],
            range: "Melee reach 1 (medium)",
            detail: "",
            impact_num_dice: "1",
            impact_dice_sides: "6",
            damage_type: {
                base: {
                    bludgeoning: true
                }
            },
            peril_mod: 2
        };
        setAttacks([
            ...attacks,
            baseAttackObj
        ]);
        const defaultsObj = {};
        Object.keys(baseAttackObj).forEach((attackKey) => {
            if (attackKey === "damage_type") {
                Object.keys(baseAttackObj[attackKey].base).forEach((damage_type) => {
                    defaultsObj[`attacks.${newestIndex}.${attackKey}.${damage_type}`] = baseAttackObj[attackKey].base[damage_type];
                });
            } else {
                defaultsObj[`attacks.${newestIndex}.${attackKey}`] = baseAttackObj[attackKey];
            }
        });
        fillFormWithPrevInfo({ ...defaultValues, ...defaultsObj });
        defaultsRef.current = { ...defaultValues, ...defaultsObj };
        // setDefaultValues({ ...defaultsObj, ...defaultValues });
    }
    useEffect(() => {
        // console.log(attacks, attacks.length);
        setDefaultValues(defaultsRef.current);
    }, [attacks])
    
    const bundleAttackFields = (index, data) => {
        const damage_type = {
            base: {}
        };
        gc.damage_types.forEach((damageType) => {
            if (data[`attacks.${index}.damage_type.${damageType}`]) {
                damage_type.base[damageType] = true;
            }
        });
        return {
            name: data[`attacks.${index}.name`],
            categories: data[`attacks.${index}.categories`],
            range: data[`attacks.${index}.range`],
            detail: data[`attacks.${index}.detail`],
            impact_num_dice: parseInt(data[`attacks.${index}.impact_num_dice`]),
            impact_dice_sides: parseInt(data[`attacks.${index}.impact_dice_sides`]),
            damage_type,
            peril_mod: parseInt(data[`attacks.${index}.peril_mod`]),
        };
    }
    const unbundleAttacks = (attacksObj) => {
        const result = {};
        attacksObj.forEach((attackObj, i) => {
            result[`attacks.${i}.name`] = attackObj.name;
            result[`attacks.${i}.categories`] = attackObj.categories;
            result[`attacks.${i}.range`] = attackObj.range;
            result[`attacks.${i}.detail`] = attackObj.detail;
            result[`attacks.${i}.impact_num_dice`] = `${attackObj.impact_num_dice}`;
            result[`attacks.${i}.impact_dice_sides`] = `${attackObj.impact_dice_sides}`;
            result[`attacks.${i}.peril_mod`] = `${attackObj.peril_mod}`;
            Object.keys(attackObj.damage_type.base).forEach((damageType) => {
                result[`attacks.${i}.damage_type.${damageType}`] = attackObj.damage_type.base[damageType];
            });
        });
        return result;
    }
    
    const fillFormWithPrevInfo = useCallback((data) => {
        // console.log(data);
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
        if (data.attacks.length) {
            defaultsRef.current = { ...newDefaults, ...unbundleAttacks(data.attacks) };
            setAttacks(data.attacks);
        } else {
            setDefaultValues(newDefaults);
        }
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
        // console.log(formData);
        const newSlug = encodeURIComponent(formData.name.split(" ").join("").toLowerCase().replace(/'/g, ""));
        const itemObj = {};
        Object.keys(formData).forEach((key) => {
            if (!key.startsWith("tag") && !key.startsWith("attack")) {
                itemObj[key] = formData[key];
            }
        })
        itemObj.tags = gc.item_tags.filter((tagName) => {
            const idString = `tag_checkbox_${tagName}`;
            return formData[idString] ? true : false;
        });
        const attacksCopy = [];
        let i = 0;
        while (formData[`attacks.${i}.name`]) {
            attacksCopy.push(bundleAttackFields(i, formData));
            i++;
        }
        itemObj.attacks = attacksCopy;
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
            className="build-items"
        >
            <h1>{props.editing ? "Edit Item" : "New Item"}</h1>
            <div className="columns">
                <div className="main-body rows">
                    <div className="rows">
                        <label htmlFor="name">Name</label>
                        <Field name="name" type="text" required />
                    </div>
                    <div className="columns">
                        <div className="rows">
                            <label htmlFor="price">Price</label>
                            <Field name="price" type="number" className="medium" />
                        </div>
                        <div className="rows">
                            <label htmlFor="bulk">Bulk</label>
                            <Field name="bulk" type="number" className="medium" />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="rows">
                            <label htmlFor="hardness">Hardness</label>
                            <Field name="hardness" type="number" className="medium" />
                        </div>
                        <div className="rows">
                            <label htmlFor="resistance">Resistance</label>
                            <Field name="resistance" type="number" className="medium" />
                        </div>
                        <div className="rows">
                            <label htmlFor="structural_save">Structural Save</label>
                            <Field name="structural_save" type="number" className="medium" />
                        </div>
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
            </div>
            <div className="columns">
                <div className="rows main-body">
                    <div className="columns">
                        <Field type="checkbox" name="worn_or_wielded" />
                        <label htmlFor="worn_or_wielded">Worn or Wielded?</label>
                        <Field type="radio" name="hands_occupied" radioValue={0} />
                        <label>0 hands</label>
                        <Field type="radio" name="hands_occupied" radioValue={1} />
                        <label>1 hand</label>
                        <Field type="radio" name="hands_occupied" radioValue={2} />
                        <label>2 hands</label>
                        <Field type="radio" name="hands_occupied" radioValue={[1, 2]} />
                        <label>1-2 hands</label>
                    </div>
                </div>
                <div className="rows right-column">
                    <label htmlFor="weapon_heft">Weapon Heft</label>
                    <Field name="weapon_heft" as="select">
                        {gc.weapon_hefts.map((heft, j) => (
                            <option key={j} value={heft}>{heft}</option>
                        ))}
                    </Field>
                </div>
            </div>
            <section className="attack-form brown-box rows">
                <h3>Attacks</h3>
                {attacks.map((attackObj, i) => (
                    <div key={i} className="columns">
                        <div className="main-body">
                            <div className="rows">
                                <label htmlFor={`attacks.${i}.name`}>Name of Attack</label>
                                <Field name={`attacks.${i}.name`} type="text" required />
                            </div>
                            <div className="rows">
                                <label htmlFor={`attacks.${i}.categories`}>Categories</label>
                                <Field name={`attacks.${i}.categories`} as="select" multiple>
                                    {gc.weapon_categories.map((category, j) => (
                                        <option key={j} value={category}>Weapon: {category}</option>
                                    ))}
                                    <option value="Natural Weapon">Weapon: Natural</option>
                                    <option value="MiscWeapon">Weapon: Other</option>
                                    <option value="Spell">Nonweapon: Spell Attack</option>
                                    <option value="Vim">Nonweapon: Vim Attack</option>
                                </Field>
                                {/* <ul className="radio-bank">
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
                                </ul> */}
                                <div className="rows">
                                    <label htmlFor={`attacks.${i}.range`}>Attack Range(s)</label>
                                    <Field name={`attacks.${i}.range`} type="text" required />
                                </div>
                                <div className="columns">
                                    <Field name={`attacks.${i}.impact_num_dice`} type="number" className="short" />
                                    <label>d</label>
                                    <Field name={`attacks.${i}.impact_dice_sides`} type="number" className="short s" />
                                    <label className="pre">base Impact; Peril mod +</label>
                                    <Field name={`attacks.${i}.peril_mod`} type="number" className="short" />
                                </div>
                            </div>
                        </div>
                        <div className="right-column rows">
                            <label>Base Damage Types</label>
                            <ul>
                                {gc.damage_types.map((damageType, j) => (
                                    <li key={j} className="checkbox-pair">
                                        <Field
                                            type="checkbox"
                                            name={`attacks.${i}.damage_type.${damageType}`}
                                        />
                                        <label>{damageType}</label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="rows">
                            <label htmlFor={`attacks.${i}.detail`}>Details</label>
                            <Field name={`attacks.${i}.detail`} as="textarea" rows="4" cols="50" />
                        </div>
                    </div>
                ))}
                <MyButton fct={newAttack}>Add Attached Attack</MyButton>
            </section>
            <MyFormButton type="submit">Save</MyFormButton>
        </Form>
    );
}

export default BuildLibraryItems;