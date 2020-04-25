// import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';

import useForm from '../../hooks/useForm';
import MyFormButton from '../ui/MyFormButton';
import { charDefault } from '../../helpers/Templates';

const NewCharForm = () => {
    const [state, dispatch] = useContext(Store);
    const db = fb.db;

    const [redirectFlag, setRedirectFlag] = useState(false);
    useEffect(() => {
        if (!state.user) {
            setRedirectFlag(true);
        }
    }, [state.user])

    const gatherChars = useCallback(async () => {
        const saveCharsToArr = (querySnapshot) => {
            const charsData = [];
            querySnapshot.forEach(doc => {
                charsData.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            dispatch({ type: "SAVE_CHARACTERS_TO_CACHE", payload: charsData });
        }
        // charStream.current = db.collection("characters").onSnapshot(querySnapshot => {
        //     saveChars(querySnapshot);
        // }).catch((err) => {
        //     console.log("Error:", err);
        // });
        try {
            const query = await db.collection("characters").get();
            saveCharsToArr(query);
        } catch(err) {
            console.log("Error:", err);
        }
    }, [db, dispatch]);
    useEffect(() => {
        if (state.shouldUpdateCharacterCache) {
            gatherChars();
        }
        // return(() => {
        //     if (charStream.current) {
        //         charStream.current();
        //     }
        // });
    }, [gatherChars, state.shouldUpdateCharacterCache])

    const [rank, setRank] = useState(null);
    useEffect(() => {
        const collectUserInfo = async () => {
            try {
                const doc = await db.collection("users").doc(state.user.uid).get();
                setRank(doc.data().rank);
            } catch(err) {
                console.log("Error:", err);
            }
        }
        if (state.user) {
            collectUserInfo();
        }
    }, [db, state.user])

    const saveNewChar = async (charObj) => {
        try {
            const id = charObj.slug;
            delete charObj.slug;
            await db.collection("characters").doc(id).set(charObj);
            dispatch({ type: "SET", key: "shouldUpdateCharacterCache", payload: true });
            setRedirectFlag(true);
        } catch(err) {
            console.log("Error:", err);
        }
    }
    const [errorMessage, setErrorMessage] = useState("");
    const checkNewChar = (ev) => {
        if (state.characterCache.length || rank === "admin") {
            const allSlugs = ["new"].concat(state.characterCache.map(charDatum => (charDatum.id)));
            if (allSlugs.includes(inputs.slug)) {
                setErrorMessage("Slug in use.");
            } else {
                const campaignsChecked = Object.keys(inputs).filter(field => field.startsWith("meb_newChar_select_"))
                    .map((field) => (field.split("_")[3]));
                if (campaignsChecked.includes("public") && campaignsChecked.includes("standard")) {
                    campaignsChecked.splice(campaignsChecked.indexOf("public"), 1);
                }
                saveNewChar({
                    ...charDefault,
                    owner: state.user.uid,
                    name: inputs.name,
                    campaigns: campaignsChecked,
                    slug: inputs.slug
                });
            }
        } else {
            setErrorMessage("Could not check other characters for slug uniqueness. Please try again later.");
        }
    }
    
    const { inputs, handleInputChange, handleSubmit } = useForm(checkNewChar);

    if (redirectFlag) return <Redirect to="/characters" />;
    return (
        <form onSubmit={handleSubmit} className="primary-content content-padding new-char-form rows">
            <h1>New Character</h1>
            <div>
                <label htmlFor="slug">Slug (shortened name; must be unique; <br />difficult to change once established)</label>
                <input
                    type="text"
                    id="slug"
                    onChange={handleInputChange}
                    value={inputs.slug || ""}
                    required
                />
            </div>
            <div className="columns">
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        onChange={handleInputChange}
                        value={inputs.name || ""}
                        required
                    />
                </div>
                <div>
                    <label>Campaign(s)</label>
                    <ul>
                        {rank === "admin" || rank === "archon" ?
                            <li key="standard">
                                <input
                                    type="checkbox"
                                    id={`meb_newChar_select_standard`}
                                    onChange={handleInputChange}
                                    value="1"
                                />
                                Standard
                            </li> :
                            null
                        }
                        <li key="public">
                            <input
                                type="checkbox"
                                id={`meb_newChar_select_public`}
                                onChange={handleInputChange}
                                value="1"
                            />
                            Public
                        </li>
                        {Object.keys(state.activeCampaigns).map((campaignId) => (
                            <li key={campaignId}>
                                <input
                                    type="checkbox"
                                    id={`meb_newChar_select_${campaignId}`}
                                    onChange={handleInputChange}
                                    value="1"
                                />
                                {state.activeCampaigns[campaignId].name}
                            </li>
                        ))}
                    </ul>
                    <p>Create new campaigns under <Link to="/user/settings">User Settings</Link>.</p>
                </div>
            </div>
            <MyFormButton type="submit" className="my-button">Save</MyFormButton>
            {errorMessage ? <p className="buffer-above error-message">{errorMessage}</p> : null}
        </form>
    );
}

export default NewCharForm;