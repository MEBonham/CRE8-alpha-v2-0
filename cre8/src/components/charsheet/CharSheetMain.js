import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { Context } from '../GlobalWrapper';
import fb from '../../fbConfig';

import { charDefault } from '../../helpers/Templates';
import CharSheetTabs from './CharSheetTabs';
import EditWrapper from './EditWrapper';
import Play from './Play';
import Configure from './Configure';
import Bio from './Bio';
import BuildLibrary from './BuildLibrary';
import '../../css/charSheet.css';
import MyButton from '../ui/MyButton';

const CharSheetMain = () => {
    const [state, dispatch] = useContext(Context);
    const { slug } = useParams();
    // const [cur, setCur] = useGlobal("cur");
    // const [usersCampaigns] = useGlobal("usersCampaigns");

    const saveIntervalMilliseconds = 500;
    const lastSave = useRef(Date.now());

    const db = fb.db;

    // const [campaigns, setCampaigns] = useState([]);
    // const campaignStream = useRef(null);
    const firstLoad = useRef(true);
    const charStream = useRef(null);
    // useEffect(() => {
    //     campaignStream.current = db.collection("campaigns")
    //         //.onSnapshot(querySnapshot => {
    //         .get().then(querySnapshot => {
    //             const campaignInfo = {};
    //             querySnapshot.forEach(campaign => {
    //                 campaignInfo[campaign.id] = campaign.data();
    //             });
    //             setCampaigns(campaignInfo);
    //         });
    
    //     // return () => {
    //     //     campaignStream.current();
    //     // };
    // }, [db])
    useEffect(() => {
        if (slug && firstLoad.current) {
            charStream.current = db.collection("characters").doc(slug)
                // .onSnapshot(doc => {
                .get().then(doc => {
                    const docDefaulted = {
                        ...charDefault,
                        ...doc.data(),
                        stats: {
                            ...charDefault.stats,
                            ...doc.data().stats
                        },
                        id: slug
                    }
                    dispatch({ type: "SET", key: "cur", payload: docDefaulted }); //setCur(docDefaulted);
                    firstLoad.current = false;
                });
        }
    
        // return () => {
        //     charStream.current();
        // };
    }, [db, dispatch, slug]);

    const [toSave, setToSave] = useState(false);
    const [charSheetTab, setCharSheetTab] = useState(null);
    const [tabContents, setTabContents] = useState(null);
    useEffect(() => {
        if (state.cur && state.cur.activeTab !== charSheetTab) {
            setCharSheetTab(state.cur.activeTab);
        }
    }, [charSheetTab, state.cur])
    useEffect(() => {
        // if (cur) {
        //     setToSave(true);
        // }
        if (charSheetTab === "play") {
            setTabContents(<Play />);
        } else if (charSheetTab === "configure") {
            setTabContents(<Configure />);
        } else if (charSheetTab === "bio") {
            setTabContents(<Bio />);
        } else if (charSheetTab === "+library") {
            setTabContents(<BuildLibrary />);
        }
    }, [charSheetTab])

    useEffect(() => {
        if (state.cur && Date.now() - lastSave.current >= saveIntervalMilliseconds) {
            setToSave(true);
            lastSave.current = Date.now();
        }
    }, [state.cur])
    const toSaveFct = () => {
        setToSave(true);
    }
    useEffect(() => {
        if (toSave) {
            const curCopy = {
                ...state.cur
            };
            const slug = curCopy.id;
            delete curCopy.id;
            db.collection("characters").doc(slug).set(curCopy)
                .then(() => {
                    setToSave(false);
                    console.log("Saved");
                    lastSave.current = Date.now();
                })
                .catch(err => {
                    console.log("Character save unsuccessful:", err);
                });
        }
    }, [state.cur, db, toSave]);

    // const [userInfo] = useGlobal("user");
    const loadComponent = useRef(
        <div className="main normal-padding">
            <h1>Loading ...</h1>
        </div>
    );
    const [component, setComponent] = useState(loadComponent.current);
    useEffect(() => {

        const determineAccess = (campaigns, userInfo) => {
            // console.log(state.cur.campaigns);
            if (state.cur && state.cur.campaigns && state.cur.campaigns.includes("standard")) return true;
            if (state.cur && state.cur.campaigns && state.cur.campaigns.includes("public")) return true;
            if (state.cur && state.user && state.cur.owner === state.user.uid) return true;
            if (campaigns && state.user) {
                Object.keys(campaigns).forEach(campaignId => {
                    if (campaigns[campaignId].members.includes(state.user.uid)) return true;
                });
            }
            return false;
        }

        // if (!cur || !usersCampaigns) {
        if (!state.cur) {
            setComponent(loadComponent.current);
        } else {
            // const access = determineAccess(campaigns, userInfo.uid);
            const access = determineAccess(state.activeCampaigns, state.user);
            if (access) {
                setComponent(<div className="main normal-padding">
                    <div className="parchment">
                        <CharSheetTabs />
                        <EditWrapper>
                            {tabContents}
                        </EditWrapper>
                    </div>
                    <div className="float-right">
                        <span className="my-button"><Link to="/characters">Back to Characters</Link></span>
                        <MyButton fct={toSaveFct}>Save</MyButton>
                    </div>
                </div>);
            } else {
                setComponent(<Redirect to="/characters" />)
            }
        }
    // }, [campaigns, cur, tabContents, userInfo])
    }, [state.activeCampaigns, state.cur, tabContents, state.user])

    return(<>
        {component}
    </>);
}

export default CharSheetMain;