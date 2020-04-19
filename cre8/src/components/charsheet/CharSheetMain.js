import React, { useState, useEffect, useRef } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import fb from '../../fbConfig';
import useGlobal from '../../hooks/useGlobal';

import { charDefault } from '../../helpers/Templates';
import CharSheetTabs from './CharSheetTabs';
import Play from './Play';
import Configure from './Configure';
import Bio from './Bio';
import BuildLibrary from './BuildLibrary';
import '../../css/charSheet.css';

const CharSheetMain = () => {
    const { slug } = useParams();
    const [userInfo] = useGlobal("user");
    const [cur, setCur] = useGlobal("cur");

    const db = fb.db;

    const [campaigns, setCampaigns] = useState([]);
    const [firstLoad, setFirstLoad] = useState(true);
    const campaignStream = useRef(null);
    const charStream = useRef(null);
    useEffect(() => {
        
        campaignStream.current = db.collection("campaigns")
            .onSnapshot(querySnapshot => {
                // console.log(querySnapshot);
                const campaignInfo = {};
                querySnapshot.forEach(campaign => {
                    campaignInfo[campaign.id] = campaign.data();
                });
                setCampaigns(campaignInfo);
            });
        
        if (firstLoad) {
            charStream.current = db.collection("characters").doc(slug)
                .onSnapshot(doc => {
                    console.log("flag");
                    const docDefaulted = {
                        ...charDefault,
                        ...doc.data(),
                        stats: {
                            ...charDefault.stats,
                            ...doc.data().stats
                        },
                        id: slug
                    }
                    setCur(docDefaulted);
                    setFirstLoad(false);
                });
        }
    
        return () => {
            campaignStream.current();
            charStream.current();
        };
    }, [db, firstLoad, setCur, slug]);

    const [charSheetTab, setCharSheetTab] = useState(null);
    const [tabContents, setTabContents] = useState(null);
    useEffect(() => {
        if (cur) {
            setCharSheetTab(cur.activeTab);
        }
    }, [cur])
    useEffect(() => {
        if (charSheetTab === "play") {
            setTabContents(<Play />);
        } else if (charSheetTab === "configure") {
            setTabContents(<Configure />);
        } else if (charSheetTab === "bio") {
            setTabContents(<Bio />);
        } else if (charSheetTab === "+library") {
            setTabContents(<BuildLibrary />);
        }
    }, [charSheetTab, cur])

    const loadComponent = useRef(
        <div className="main normal-padding">
            <h1>Loading ...</h1>
        </div>
    );
    const [component, setComponent] = useState(loadComponent.current);
    useEffect(() => {

        const determineAccess = (campaigns, uid) => {
            if (cur && cur.campaigns && cur.campaigns.includes("standard")) return true;
            if (cur && cur.campaigns && cur.campaigns.includes("public")) return true;
            if (cur && uid && cur.owner === uid) return true;
            if (campaigns && uid) {
                Object.keys(campaigns).forEach(campaignId => {
                    if (campaigns[campaignId].members.includes(uid)) return true;
                });
            }
            return false;
        }

        if (!cur || !campaigns) {
            setComponent(loadComponent.current);
        } else {
            const access = determineAccess(campaigns, userInfo.uid);
            if (access) {
                setComponent(<div className="main normal-padding">
                    <div className="parchment">
                        <CharSheetTabs />
                        {tabContents}
                    </div>
                </div>);
            } else {
                setComponent(<Redirect to="/characters" />)
            }
        }
    }, [campaigns, cur, tabContents, userInfo])

    return(<>
        {component}
    </>);
}

export default CharSheetMain;