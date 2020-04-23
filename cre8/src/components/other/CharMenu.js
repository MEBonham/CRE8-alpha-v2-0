// import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import MyLink from '../ui/MyLink';

const CharMenu = () => {
    const [state, dispatch] = useContext(Store);
    // Close menu that presumably led you here
    useEffect(() => {
        dispatch({ type: "SET", key: "mainNavMenuOpen", payload: false });
    }, [dispatch])

    const [orphans, setOrphans] = useState([]);
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
        // charStream.current = fb.db.collection("characters").onSnapshot(querySnapshot => {
        //     saveChars(querySnapshot);
        // }).catch((err) => {
        //     console.log("Error:", err);
        // });
        try {
            const query = await fb.db.collection("characters").get();
            saveCharsToArr(query);
        } catch(err) {
            console.log("Error:", err);
        }
    }, [dispatch]);
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
    useEffect(() => {
        if (state.user) {
            setOrphans(state.characterCache.filter(charData => charData.campaigns.length === 0 && charData.owner === state.user.uid));
        }
    }, [state.characterCache, state.user])

    const [campaignIds, setCampaignIds] = useState([]);
    useEffect(() => {
        const usersCampaignsCopy = { ...state.activeCampaigns };
        delete usersCampaignsCopy.standard;
        delete usersCampaignsCopy.public;
        if (Object.keys(usersCampaignsCopy).length) setCampaignIds(Object.keys(usersCampaignsCopy));
    }, [state.activeCampaigns])

    return(
        <div className="primary-content content-padding char-library">
            <section className="rows">
                <h1>Character Library</h1>
                <MyLink to="/characters/new">New Character</MyLink>
            </section>
            {campaignIds.length ?
                <section>
                    <h2>Your Campaign Characters</h2>
                    {campaignIds.map((campaignId, i) => {
                        const campaignObj = state.activeCampaigns[campaignId];
                        return (
                            <section key={campaignId} className={i + 1 < campaignIds.length ? "not-last" : null}>
                                <h3>{campaignObj.name}</h3>
                                {state.characterCache.filter(charData => charData.campaigns.includes(campaignId))
                                    .map(charData => {
                                        const toAddress = `/characters/${charData.id}`;
                                        return (
                                            <p key={charData.id}>
                                                <Link to={toAddress}>{charData.name}</Link>
                                            </p>
                                        );
                                    })}
                            </section>
                        );
                    })}
                </section> :
            null}
            {orphans.length ?
                <section>
                    <h2>Your Orphaned Characters</h2>
                    {orphans.map(charData => {
                        const toAddress = `/characters/${charData.id}`;
                        return(
                            <p key={charData.id}>
                                <Link to={toAddress}>{charData.name}</Link>
                            </p>
                        );
                    })}
                </section> :
            null}
            <section>
                <h2>Standard Characters</h2>
                {state.characterCache.filter(charData => charData.campaigns.includes("standard"))
                    .map(charData => {
                        const toAddress = `/characters/${charData.id}`;
                        return (
                            <p key={charData.id}>
                                <Link to={toAddress}>{charData.name}</Link>
                            </p>
                        );
                    })
                }
            </section>
            <section>
                <h2>Other Public Characters</h2>
                {state.characterCache.filter(charData => charData.campaigns.includes("public"))
                    .map(charData => {
                        const toAddress = `/characters/${charData.id}`;
                        return (
                            <p key={charData.id}>
                                <Link to={toAddress}>{charData.name}</Link>
                            </p>
                        );
                    })
                }
            </section>
        </div>
    );
}

export default CharMenu;