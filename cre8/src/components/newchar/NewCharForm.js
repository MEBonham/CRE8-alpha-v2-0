import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';

import useForm from '../../hooks/useForm';
import MyFormButton from '../ui/MyFormButton';
import { charDefault } from '../../helpers/Templates';
import gc from '../../helpers/GameConstants';
import { updateVariousMods } from '../../helpers/Calculations';

const NewCharForm = () => {
    const [state, dispatch] = useContext(Store);
    const db = fb.db;

    // Protect against memory leak
    const _isMounted = useRef(false);
    useEffect(() => {
        _isMounted.current = true;
        return(() => {
            _isMounted.current = false;
        });
    }, [])

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

    const saveNewChar = async (charObj) => {
        try {
            const id = charObj.slug;
            delete charObj.slug;
            await db.collection("characters").doc(id).set(charObj);
            dispatch({ type: "SET", key: "shouldUpdateCharacterCache", payload: true });
            if (_isMounted.current) {
                setRedirectFlag(true);
            }
        } catch(err) {
            console.log("Error:", err);
        }
    }
    const [errorMessage, setErrorMessage] = useState("");
    const checkNewChar = (ev) => {
        if (state.characterCache.length || (state.user && state.user.rank === "admin")) {
            const encodedSlug = encodeURIComponent(inputs.slug.split(" ").join("").toLowerCase());
            const allSlugs = ["new"].concat(state.characterCache.map(charDatum => (charDatum.id)));
            if (allSlugs.includes(encodedSlug)) {
                setErrorMessage("Slug in use.");
            } else {
                const campaignsChecked = Object.keys(inputs).filter(field => field.startsWith("meb_newChar_select_"))
                    .map((field) => (field.split("_")[3]));
                if (campaignsChecked.includes("public") && campaignsChecked.includes("standard")) {
                    campaignsChecked.splice(campaignsChecked.indexOf("public"), 1);
                }
                const skillRanksObj = {};
                const skillModsObj = {};
                gc.skills_list.forEach((skill) => {
                    skillRanksObj[skill] = 0;
                    skillModsObj[skill] = {};
                });
                saveNewChar({
                    ...charDefault,
                    owner: state.user.uid,
                    name: inputs.name,
                    campaigns: campaignsChecked,
                    slug: encodedSlug,
                    stats: updateVariousMods({
                        ...charDefault.stats,
                        skill_ranks: skillRanksObj,
                        skill_mods: skillModsObj
                    })
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
                <label htmlFor="slug">Slug (short name; must be unique & lowercase; <br />difficult to change once established)</label>
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
                        {state.user && (state.user.rank === "admin" || state.user.rank === "archon") ?
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