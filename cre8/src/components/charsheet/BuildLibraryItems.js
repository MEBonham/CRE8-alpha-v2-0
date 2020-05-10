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
        tagDefaults[`itemTag_checkbox_${tag}`] = false;
    });
    const [defaultValues, setDefaultValues] = useState({ ...itemDefault, ...tagDefaults });
    
    const fillFormWithPrevInfo = useCallback((data) => {
        setDefaultValues(data);
    }, []);

    const saveItem = async (newSlug, itemObj) => {
        try {
            await db.collection("items").doc(newSlug).set({
                ...itemDefault,
                ...itemObj
            });
            // if (props.editing) {
            //     fillFormWithPrevInfo(itemObj);
            // } else {
            //     reset();
            // }
        } catch(err) {
            console.log("Error:", err);
        }
    }
    const processItemForm = (formData) => {
        // console.log(formData);
        const newSlug = encodeURIComponent(formData.name.split(" ").join("").toLowerCase());
        const itemObj = {};
        Object.keys(formData).forEach((key) => {
            if (!key.startsWith("itemTag")) {
                itemObj[key] = formData[key];
            }
        })
        itemObj.tags = gc.item_tags.filter((tagName) => {
            const idString = `itemTag_checkbox_${tagName}`;
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

    const test = (ev, inputs) => {
        alert(JSON.stringify(inputs, null, 2));
    }

    if (props.editing && !slug) return <Redirect to="/library/items" />;
    if (code404) return <Redirect to="/library/items" />;
    if (state.user && state.user.rank === "peasant") return <Redirect to="/library/items" />;
    return (
        <Form onSubmit={test} defaultValues={defaultValues} className="build-items">
            <h1>{props.editing ? "Edit Item" : "New Item"}</h1>
            <div className="rows">
                <label htmlFor="name">Name</label>
                <Field name="name" />
                <MyFormButton type="submit">Save</MyFormButton>
            </div>
        </Form>
    );
    // return (
    //     <form onSubmit={handleSubmit(processItemForm)} className="build-library build-item">
    //         <header className="columns">
    //             <div className="rows main-body">
    //                 {props.editing ? <h2>Edit Item</h2> : <h2>New Item</h2>}
    //                 <div className="rows">
    //                     <h3>Name</h3>
    //                     <Controller
    //                         as="input"
    //                         type="text"
    //                         rules={{required: true}}
    //                         name="name"
    //                         control={control}
    //                     />
    //                 </div>
    //                 <div className="rows">
    //                     <h3>Price</h3>
    //                     <Controller
    //                         as="input"
    //                         type="number"
    //                         name="price"
    //                         control={control}
    //                     />
    //                 </div>
    //                 <div className="rows">
    //                     <h3>Bulk</h3>
    //                     <Controller
    //                         as="input"
    //                         type="number"
    //                         rules={{required: true}}
    //                         name="bulk"
    //                         control={control}
    //                     />
    //                 </div>
    //                 <div className="rows">
    //                     <h3>Description</h3>
    //                     <Controller
    //                         as="textarea"
    //                         name="description"
    //                         control={control}
    //                         rows="4"
    //                         cols="54"
    //                     />
    //                 </div>
    //             </div>
    //             <div className="right-column">
    //                 <h3>Tags</h3>
    //                 <ul>
    //                     {gc.item_tags.map((tag) => (
    //                         <li key={tag} className="checkbox-pair">
    //                             <Controller
    //                                 as="input"
    //                                 type="checkbox"
    //                                 name={`itemTag_checkbox_${tag}`}
    //                                 control={control}
    //                                 valueName="checked"
    //                                 onChange={handleCheckbox}
    //                             />
    //                             <label>{tag}</label>
    //                         </li>
    //                     ))}
    //                 </ul>
    //             </div>
    //         </header>
    //         <MyFormButton type="submit">Save</MyFormButton>
    //     </form>
    // );
}

export default BuildLibraryItems;