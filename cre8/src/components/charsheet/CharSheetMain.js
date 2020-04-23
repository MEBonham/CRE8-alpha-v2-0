import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { Redirect, useParams } from 'react-router-dom';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import Code404 from '../other/Code404';
import LoadingAlert from '../other/LoadingAlert';
import MyLink from '../ui/MyLink';
import MyButton from '../ui/MyButton';
import { charDefault } from '../../helpers/Templates';
// import CharSheetTabs from './CharSheetTabs';
// import EditWrapper from './EditWrapper';

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
    }, [state.activeCampaigns, state.cur, state.user]);
    useEffect(() => {
        if (!checkAccess()) {
            setRedirectFlag(true);
        }
    }, [checkAccess, state.activeCampaigns])

    const tabContents = () => {
        return null;
    }

    const [toSave, setToSave] = useState(false);
    const toSaveFct = (ev) => {
        setToSave(true);
    }

    if (code404) return <Code404 />
    if (redirectFlag) return <Redirect to="/characters" />
    if (!state.cur) return <LoadingAlert />
    return(
        <div className="primary-content content-padding char-sheet">
            <div className="parchment">
                {/* <CharSheetTabs /> */}
                {/* <EditWrapper> */}
                    {tabContents()}
                {/* </EditWrapper> */}
            </div>
            <div className="float-right columns">
                <MyLink to="/characters">Back to Characters</MyLink>
                <MyButton fct={toSaveFct}>Save</MyButton>
            </div>
        </div>
    )
}

export default CharSheetMain;