import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';

import Code404 from '../other/Code404';
import { charDefault } from '../../helpers/Templates';

const CharSheetMain = () => {
    const [state, dispatch] = useContext(Store);
    const { slug } = useParams();
    const db = fb.db;

    const [code404, setCode404] = useState(false);
    const charStream = useRef(null);
    const loadCur = useCallback(() => {
        charStream.current = db.collection("characters").doc(slug)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    const docDefaulted = {
                        ...charDefault,
                        ...doc.data(),
                        stats: {
                            ...charDefault.stats,
                            ...doc.data().stats
                        },
                        id: slug
                    };
                    dispatch({ type: "UPDATE_CUR", payload: docDefaulted });
                } else {
                    setCode404(true);
                }
            });
    }, [db, dispatch, slug]);
    useEffect(() => {
        loadCur();
        return(() => {
            if (charStream.current) {
                charStream.current();
            }
        });
    }, [loadCur])

    const [redirectFlag, setRedirectFlag] = useState(false);
    const checkAccess = useCallback(() => {
        if (!state.cur) return true;
        if (state.cur.campaigns.includes("public")) return true;
        if (state.cur.campaigns.includes("standard")) return true;
        if (state.user && state.cur.owner === state.user.uid) return true;
        let activeCampaignsCopy = { ...state.activeCampaigns };
        delete activeCampaignsCopy.standard;
        delete activeCampaignsCopy.public;
        state.cur.campaigns.forEach((campaignId) => {
            if (activeCampaignsCopy[campaignId]) return true;
        });
        return false;
    }, [state.activeCampaigns, state.cur]);
    useEffect(() => {
        if (!checkAccess()) {
            setRedirectFlag(true);
        }
    }, [checkAccess, state.activeCampaigns])

    if (code404) return <Code404 />
    if (redirectFlag) return <Redirect to="/characters" />
    return(
        <div className="primary-content content-padding">

        </div>
    )
}

export default CharSheetMain;