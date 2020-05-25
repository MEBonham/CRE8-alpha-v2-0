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

    const [variousBonuses, setVariousBonuses] = useState([]);
    const newVBonus = (ev) => {
        const newestIndex = variousBonuses.length;
        const baseBonusObj = {
            type: "Item",
            num: 1,
            to: "av_mods",
            skill: "Brawn"
        };
        setVariousBonuses([
            ...variousBonuses,
            baseBonusObj
        ]);
        const defaultsObj = {};
        Object.keys(baseBonusObj).forEach((bonusKey) => {
            defaultsObj[`variousBonuses.${newestIndex}.${bonusKey}`] = baseBonusObj[bonusKey];
        });
        fillFormWithPrevInfo({ ...defaultValues, ...defaultsObj });
        defaultsRef.current = { ...defaultValues, ...defaultsObj };
    }
    const [variousPenalties, setVariousPenalties] = useState([]);
    const newVPenalty = (ev) => {
        const newestIndex = variousPenalties.length;
        const basePenaltyObj = {
            type: "Item",
            num: -1,
            to: "fortitude_mods"
        };
        setVariousPenalties([
            ...variousPenalties,
            basePenaltyObj
        ]);
        const defaultsObj = {};
        Object.keys(basePenaltyObj).forEach((penaltyKey) => {
            defaultsObj[`variousPenalties.${newestIndex}.${penaltyKey}`] = basePenaltyObj[penaltyKey];
        });
        fillFormWithPrevInfo({ ...defaultValues, ...defaultsObj });
        defaultsRef.current = { ...defaultValues, ...defaultsObj };
    }
    useEffect(() => {
        // console.log(attacks, attacks.length);
        setDefaultValues(defaultsRef.current);
    }, [attacks, variousBonuses, variousPenalties])
    const unbundleBonuses = (bonusesObj) => {
        const result = {};
        bonusesObj.forEach((bonusObj, i) => {
            result[`variousBonuses.${i}.num`] = bonusObj.num;
            result[`variousBonuses.${i}.type`] = bonusObj.type;
            result[`variousBonuses.${i}.to`] = bonusObj.to;
            result[`variousBonuses.${i}.skill`] = bonusObj.skill;
        });
        return result;
    }
    const unbundlePenalties = (penaltiesObj) => {
        const result = {};
        penaltiesObj.forEach((penaltyObj, i) => {
            result[`variousPenalties.${i}.num`] = penaltyObj.num;
            result[`variousPenalties.${i}.type`] = penaltyObj.type;
            result[`variousPenalties.${i}.to`] = penaltyObj.to;
            result[`variousPenalties.${i}.skill`] = penaltyObj.skill;
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
            // } else if (key === "various_bonuses") {
            //     setVariousBonuses(data[key].map((bonus) => {
            //         const bonusObj = {};
            //         bonusObj.type = bonus.type || "Item";
            //         bonusObj.to = bonus.to || "av_mods";
            //         bonusObj.num = bonus.num || 1;
            //         bonusObj.skill = bonus.skill || "Brawn";
            //         return bonusObj;
            //     }));
            // } else if (key === "various_penalties") {
            //     setVariousPenalties(data[key].map((penalty) => {
            //         const penaltyObj = {};
            //         penaltyObj.type = penalty.type || "Item";
            //         penaltyObj.to = penalty.to || "fortitude_mods";
            //         penaltyObj.num = penalty.num || -1;
            //         return penaltyObj;
            //     }));
            } else {
                newDefaults[key] = data[key];
            }
        });
        defaultsRef.current = newDefaults;
        if (data.attacks.length) {
            defaultsRef.current = { ...defaultsRef.current, ...unbundleAttacks(data.attacks) };
            setAttacks(data.attacks);
        }
        if (data.various_bonuses.length) {
            defaultsRef.current = { ...defaultsRef.current, ...unbundleBonuses(data.various_bonuses) };
            setVariousBonuses(data.various_bonuses);
        }
        if (data.various_penalties.length) {
            defaultsRef.current = { ...defaultsRef.current, ...unbundlePenalties(data.various_penalties) };
            setVariousPenalties(data.various_penalties);
        }
        // if (data.attacks.length) {
        //     defaultsRef.current = { ...newDefaults, ...unbundleAttacks(data.attacks) };
        //     setAttacks(data.attacks);
        // } else {
        //     setDefaultValues(newDefaults);
        // }
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
                setVariousBonuses([]);
                setVariousPenalties([]);
            }
        } catch(err) {
            console.log("Error:", err);
        }
    }
    
    const bundleVariousMods = (data) => {
        const arr = [];
        const arr2 = [];
        let i = 0;
        while (data[`variousBonuses.${i}.to`]) {
            if (data[`variousBonuses.${i}.type`] === "Select" || data[`variousBonuses.${i}.to`] === "Select") continue;
            if (data[`variousBonuses.${i}.num`] >= 0) {
                arr.push({
                    num: parseInt(data[`variousBonuses.${i}.num`]),
                    type: data[`variousBonuses.${i}.type`],
                    to: data[`variousBonuses.${i}.to`],
                    skill: data[`variousBonuses.${i}.skill`]
                });
            } else {
                arr2.push({
                    num: parseInt(data[`variousBonuses.${i}.num`]),
                    type: data[`variousBonuses.${i}.type`],
                    to: data[`variousBonuses.${i}.to`]
                });
            }
            i++;
        }
        i = 0;
        while (data[`variousPenalties.${i}.to`]) {
            if (data[`variousPenalties.${i}.type`] === "Select" || data[`variousPenalties.${i}.to`] === "Select") continue;
            if (data[`variousPenalties.${i}.num`] >= 0) {
                arr.push({
                    num: parseInt(data[`variousPenalties.${i}.num`]),
                    type: data[`variousPenalties.${i}.type`],
                    to: data[`variousPenalties.${i}.to`]
                });
            } else {
                arr2.push({
                    num: parseInt(data[`variousPenalties.${i}.num`]),
                    type: data[`variousPenalties.${i}.type`],
                    to: data[`variousPenalties.${i}.to`]
                });
            }
            i++;
        }
        return [arr, arr2];
    }
    const processItemForm = (ev, formData) => {
        // console.log(formData);
        const newSlug = encodeURIComponent(formData.name.split(" ").join("").toLowerCase().replace(/'/g, ""));
        const itemObj = {
            various_bonuses: []
        };
        Object.keys(formData).forEach((key) => {
            if (!key.startsWith("tag") && !key.startsWith("attack") && !key.startsWith("variousBonus") &&
                    !key.startsWith("variousPenal")) {
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
        const [bonuses, penalties] = bundleVariousMods(formData);
        itemObj.various_bonuses = bonuses;
        itemObj.various_penalties = penalties;
        console.log(itemObj);
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
                    <div>
                        <label htmlFor="halve_bulk_capacity">Halve-Bulk Capacity (0 to disable):</label>
                        <Field type="number" name="halve_bulk_capacity" />
                    </div>
                </div>
                <div className="rows right-column">
                    <label htmlFor="weapon_heft">Weapon Heft</label>
                    <Field name="weapon_heft" as="select">
                        {gc.weapon_hefts.map((heft, j) => (
                            <option key={j} value={heft}>{heft}</option>
                        ))}
                    </Field>
                    <label htmlFor="weapon_grade">Weapon Grade</label>
                    <Field name="weapon_grade" as="select">
                        <option value="simple">Simple</option>
                        <option value="martial">Martial</option>
                        <option value="exotic">Exotic</option>
                    </Field>
                    <label htmlFor="armor_girth">Armor Girth</label>
                    <Field name="armor_girth" as="select">
                        <option value="light">Light</option>
                        <option value="heavy">Heavy</option>
                    </Field>
                </div>
            </div>
            <section className="various-bonuses rows brown-box">
                <label>Various Bonuses</label>
                <ul>
                    {variousBonuses.map((bonus, i) => (
                        <li key={`${i}`}>
                            <div className="columns">
                                <Field name={`variousBonuses.${i}.num`} type="number" className="short s" />
                                <Field name={`variousBonuses.${i}.type`} as="select">
                                    <option value={"Select"}>Select</option>
                                    {gc.bonus_types.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </Field>
                                <label>bonus to</label>
                                <Field name={`variousBonuses.${i}.to`} as="select">
                                    <option value={"Select"}>Select</option>
                                    {gc.bonus_targets.map((stat) => (
                                        <option key={stat.code} value={stat.code}>{stat.name}</option>
                                    ))}
                                </Field>
                                <label>(if Synergy, based on</label>
                                <Field name={`variousBonuses.${i}.skill`} as="select" value="Brawn">
                                    {gc.skills_list.map((skill) => (
                                        <option key={skill} value={skill}>{skill}</option>
                                    ))}
                                </Field>
                                <label>)</label>
                            </div>
                        </li>
                    ))}
                </ul>
                <MyButton fct={newVBonus}>Add Bonus</MyButton>
            </section>
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
            <section className="various-penalties rows brown-box">
                <label>Various Penalties</label>
                <ul>
                    {variousPenalties.map((bonus, i) => (
                        <li key={`${i}`}>
                            <div className="columns">
                                <Field name={`variousPenalties.${i}.num`} type="number" className="short s" />
                                <Field name={`variousPenalties.${i}.type`} as="select">
                                    <option value={"Select"}>Select</option>
                                    {gc.bonus_types.flatMap((type) => {
                                        if (type === "Synergy") {
                                            return [];
                                        } else {
                                            return [<option key={type} value={type}>{type}</option>];
                                        }
                                    })}
                                </Field>
                                <label>penalty to</label>
                                <Field name={`variousPenalties.${i}.to`} as="select">
                                    <option value={"Select"}>Select</option>
                                    {gc.bonus_targets.map((stat) => (
                                        <option key={stat.code} value={stat.code}>{stat.name}</option>
                                    ))}
                                </Field>
                            </div>
                        </li>
                    ))}
                </ul>
                <MyButton fct={newVPenalty}>Add Penalty</MyButton>
            </section>
            <MyFormButton type="submit">Save</MyFormButton>
        </Form>
    );
}

export default BuildLibraryItems;