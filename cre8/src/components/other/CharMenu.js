import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import fb from '../../fbConfig';
import useGlobal from '../../hooks/useGlobal';

const CharMenu = () => {

    const db = fb.db;
    const [userInfo] = useGlobal("user");

    const [characters, setCharacters] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const charStream = useRef(null);
    const campaignStream = useRef(null);
    useEffect(() => {
        charStream.current = db.collection("characters")
            .onSnapshot(querySnapshot => {
                const charsData = [];
                querySnapshot.forEach(doc => {
                    charsData.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                setCharacters(charsData);
            });
        
        campaignStream.current = db.collection("campaigns")
            .onSnapshot(querySnapshot => {
                const campaignData = [];
                querySnapshot.forEach(campaign => {
                    campaignData.push({
                        id: campaign.id,
                        ...campaign.data()
                    });
                });
                setCampaigns(campaignData.filter(campaignObj => campaignObj.members.indexOf(userInfo.uid) >= 0));
            });
    
        return () => {
            charStream.current();
            campaignStream.current();
        };
    }, [db, userInfo]);

    return(
        <div className="main normal-padding">
            <h1>Character Library</h1>
            <div className="my-button">
                <Link to="/characters/new">New Character</Link>
            </div>
            {campaigns.length ? <h2>Your Campaign Characters</h2> : null}
            {campaigns.map(campaignObj => (
                <section key={campaignObj.id}>
                    <h3>{campaignObj.name}</h3>
                    {characters.filter(charData => charData.campaigns.indexOf(campaignObj.id) >= 0)
                        .map(charData => {
                            const toAddress = `/characters/${charData.id}`;
                            return(
                                <p>
                                    <Link to={toAddress}>{charData.id}</Link>
                                </p>
                            );
                        })}
                </section>
            ))}
            <section>
                <h2>Standard Characters</h2>
                {characters.filter(charData => charData.campaigns.indexOf("standard") >= 0)
                    .map(charData => {
                        const toAddress = `/characters/${charData.id}`;
                        return(
                            <p>
                                <Link to={toAddress}>{charData.id}</Link>
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
        </div>
    );
}

export default CharMenu;