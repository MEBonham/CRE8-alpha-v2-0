import React, { useState, useEffect, useRef, useContext } from 'react';
import { Redirect, Link } from 'react-router-dom';
import fb from '../../fbConfig';
import { Context } from '../GlobalWrapper';
import useForm from '../../hooks/useForm';

const NewCharForm = () => {
    const [{ user, activeCampaigns }] = useContext(Context);
    const db = fb.db;
    // const [userInfo] = useGlobal("user");
    // const [usersCampaigns] = useGlobal("usersCampaigns");

    const [characters, setCharacters] = useState([]);
    const charStream = useRef(null);
    useEffect(() => {
        charStream.current = db.collection("characters")
            // .onSnapshot(querySnapshot => {
            .get().then(querySnapshot => {
                const charsData = [];
                querySnapshot.forEach(doc => {
                    charsData.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                setCharacters(charsData);
            });
    
        // return () => {
        //     charStream.current();
        // };
    }, [db, user]);

    const [rank, setRank] = useState(null);
    useEffect(() => {
        if (user) {
            const docRef = fb.db.collection("users").doc(user.uid);
            docRef.get()
                .then((doc) => {
                    setRank(doc.data().rank);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }, [user])
    
    const [errorMessage, setErrorMessage] = useState("");
    const [redirectFlag, setRedirectFlag] = useState(false);
    const saveChar = () => {
        if (characters.length || rank === "admin") {
            const allSlugs = ["new"];
            characters.forEach(charData => {
                allSlugs.push(charData.id);
            });
            if (allSlugs.includes(inputs.slug)) {
                setErrorMessage("Slug in use.");
            } else {
                const fields = Object.keys(inputs).filter(field => field.startsWith("select_"));
                const campaignsChecked = fields.map(field => (
                    field.split("_")[1]
                ));
                db.collection("characters").doc(inputs.slug).set({
                    owner: user.uid,
                    name: inputs.name,
                    campaigns: campaignsChecked
                })
                .then(() => {
                    setRedirectFlag(true);
                })
                .catch(err => {
                    console.log(err);
                })
            }
        } else {
            setErrorMessage("Could not check database for slug uniqueness.");
        }
    }
    const { inputs, handleInputChange, handleSubmit } = useForm(saveChar);

    const component = redirectFlag ?
        <Redirect to="/characters" /> :
        <form onSubmit={handleSubmit} className="new-char-form normal-padding">
            <h1>New Character</h1>
            <div>
                <label htmlFor="slug">Slug (shortened name; must be unique; difficult to change once established)</label>
                <input
                    type="text"
                    id="slug"
                    onChange={handleInputChange}
                    value={inputs.slug || ""}
                    required
                />
            </div>
            <div className="column-envelope">
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        onChange={handleInputChange}
                        value={inputs.name || ""}
                    />
                </div>
                <div>
                    <label>Campaign(s)</label>
                    <ul>
                        {rank === "admin" || rank === "archon" ?
                            <li key="standard">
                                <input
                                    type="checkbox"
                                    id={`select_standard`}
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
                                id={`select_public`}
                                onChange={handleInputChange}
                                value="1"
                            />
                            Public
                        </li>
                        {Object.keys(activeCampaigns).map(campaignId => {
                            return(
                                <li key={campaignId}>
                                    <input
                                        type="checkbox"
                                        id={`select_${campaignId}`}
                                        onChange={handleInputChange}
                                        value="1"
                                    />
                                    {activeCampaigns[campaignId].name}
                                </li>
                            );
                        })}
                    </ul>
                    <p>Create new campaigns under <Link to="/user/settings">User Settings</Link>.</p>
                </div>
            </div>
            <button type="submit">Save Character</button>
            {errorMessage ? <p>{errorMessage}</p> : null}
        </form>;

    return (component);
}

export default NewCharForm;