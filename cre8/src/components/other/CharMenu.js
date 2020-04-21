import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import fb from '../../fbConfig';
import { Context } from '../GlobalWrapper';

const CharMenu = () => {
    const [state] = useContext(Context);
    const { user, activeCampaigns } = state;
    const db = fb.db;
    // const [userInfo] = useGlobal("user");
    // const [usersCampaigns] = useGlobal("usersCampaigns");

    const [characters, setCharacters] = useState([]);
    const [orphans, setOrphans] = useState([]);
    // const [campaigns, setCampaigns] = useState([]);
    // const campaignStream = useRef(null);
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
        
        // campaignStream.current = db.collection("campaigns")
        //     // .onSnapshot(querySnapshot => {
        //     .get().then(querySnapshot => {
        //         const campaignData = [];
        //         querySnapshot.forEach(campaign => {
        //             campaignData.push({
        //                 id: campaign.id,
        //                 ...campaign.data()
        //             });
        //         });
        //         if (userInfo) {
        //             setCampaigns(campaignData.filter(campaignObj => campaignObj.members.indexOf(userInfo.uid) >= 0));
        //         }
        //     });
    
        // return () => {
        //     charStream.current();
        //     // campaignStream.current();
        // };
    }, [db, user]);

    useEffect(() => {
        if (user) {
            setOrphans(characters.filter(charData => charData.campaigns.length === 0 && charData.owner === user.uid));
        }
    }, [characters, user])

    const [campaignIds, setCampaignIds] = useState([]);
    useEffect(() => {
        const usersCampaignsCopy = { ...activeCampaigns };
        delete usersCampaignsCopy.standard;
        delete usersCampaignsCopy.public;
        if (Object.keys(usersCampaignsCopy)) setCampaignIds(Object.keys(usersCampaignsCopy));
    }, [activeCampaigns])

    return(
        <div className="main normal-padding char-menu">
            <h1>Character Library</h1>
            <div className="my-button spacing-14px">
                <Link to="/characters/new">New Character</Link>
            </div>
            <section>
                {campaignIds.length ? <h2>Your Campaign Characters</h2> : null}
                {campaignIds.map((campaignId, i) => {
                    const campaignObj = activeCampaigns[campaignId];
                    return (
                        <section key={campaignId} className={i + 1 < campaignIds.length ? "not-last" : null}>
                            <h3>{campaignObj.name}</h3>
                            {characters.filter(charData => charData.campaigns.includes(campaignId))
                                .map(charData => {
                                    const toAddress = `/characters/${charData.id}`;
                                    return(
                                        <p key={charData.id}>
                                            <Link to={toAddress}>{charData.name}</Link>
                                        </p>
                                    );
                                })}
                        </section>
                    );
                })}
            </section>
            <section>
                <h2>Standard Characters</h2>
                {characters.filter(charData => charData.campaigns.indexOf("standard") >= 0)
                    .map(charData => {
                        const toAddress = `/characters/${charData.id}`;
                        return(
                            <p key={charData.id}>
                                <Link to={toAddress}>{charData.name}</Link>
                            </p>
                        );
                    })}
            </section>
            <section>
                <h2>Other Public Characters</h2>
                {characters.filter(charData => charData.campaigns.indexOf("public") >= 0)
                    .map(charData => {
                        const toAddress = `/characters/${charData.id}`;
                        return(
                            <p key={charData.id}>
                                <Link to={toAddress}>{charData.name}</Link>
                            </p>
                        );
                    })}
            </section>
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
                null
            }
        </div>
    );
}

export default CharMenu;