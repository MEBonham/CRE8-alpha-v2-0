import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { Prompt, Redirect, useParams, useRouteMatch } from 'react-router-dom';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import Code404 from '../other/Code404';
import LoadingAlert from '../other/LoadingAlert';
import MyLink from '../ui/MyLink';
import MyButton from '../ui/MyButton';
import { charDefault } from '../../helpers/Templates';
import CharSheetMain from './CharSheetMain';
import '../../css/charSheet.css';

// Guards access to and provides padding for CharSheetMain.
const CharSheetShell = () => {
    const [state, dispatch] = useContext(Store);
    const { slug } = useParams();
    const match = useRouteMatch();
    const db = fb.db;

    // Protect against memory leak
    const _isMounted = useRef(false);
    useEffect(() => {
        _isMounted.current = true;
        return(() => {
            _isMounted.current = false;
        });
    }, [])

    // Manually triggered re-load from database
    const [manualLoad, setManualLoad] = useState(false);
    const manualLoadFct = (ev) => {
        setManualLoad(true);
    }

    // Check if the page should even exist, load cur from database
    const [code404, setCode404] = useState(false);
    // const charStream = useRef(null);
    const loadCur = useCallback(async () => {
        // charStream.current = db.collection("characters").doc(slug)
            // .onSnapshot((doc) => {
            // });
        try {
            const doc = await db.collection("characters").doc(slug).get();
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
                dispatch({ type: "UPDATE_CUR_FROM_DB", payload: docDefaulted });
            } else {
                if (_isMounted.current) {
                    setCode404(true);
                }
            }
        } catch(err) {
            console.log("Error:", err);
        }
    }, [db, dispatch, slug]);
    useEffect(() => {
        loadCur();
        setManualLoad(false);
        // return(() => {
        //     if (charStream.current) {
        //         charStream.current();
        //     }
        // });
    }, [loadCur, manualLoad])

    // Divert the user if they don't have access to this character
    const [redirectFlag, setRedirectFlag] = useState(false);
    const checkAccess = useCallback(() => {
        if (!state.cur) return true;
        if (state.cur.campaigns.includes("public")) return true;
        if (state.cur.campaigns.includes("standard")) return true;
        if (state.user && state.cur.owner === state.user.uid) return true;
        if (state.user && state.user.rank === "admin") return true;
        let activeCampaignsCopy = { ...state.activeCampaigns };
        delete activeCampaignsCopy.standard;
        delete activeCampaignsCopy.public;
        let test = false;
        state.cur.campaigns.forEach((campaignId) => {
            if (activeCampaignsCopy[campaignId]) test = true;
        });
        return test;
    }, [state.activeCampaigns, state.cur, state.user]);

    // Determine which buttons show under the character sheet (based on user's level of access)
    const [owner, setOwner] = useState(null);
    const prevOwner = useRef(owner);
    useEffect(() => {
        // Should restrict relatively expensive calls to only when the owner changes
        if (state.cur && state.cur.owner !== prevOwner.current) {
            setOwner(state.cur.owner);
            prevOwner.current = state.cur.owner;
        }
    }, [state.cur]);
    const [adminPrivilege, setAdminPrivilege] = useState(false);
    const checkAdminPriv = useCallback((user) => {
        if (user.rank === "admin" || (owner === user.uid)) {
            setAdminPrivilege(true);
            return true;
        } else {
            setAdminPrivilege(false);
            return false;
        }
    }, [owner]);
    const checkEditPriv = useCallback((user) => {
        if (checkAdminPriv(user)) {
            dispatch({ type: "SET", key: "editPrivilege", payload: true });
        } else if (state.cur && state.cur.campaigns.includes("public") && user.rank === "archon") {
            dispatch({ type: "SET", key: "editPrivilege", payload: true });
        } else if (state.cur && state.cur.campaigns.includes("standard") && user.rank === "archon") {
            dispatch({ type: "SET", key: "editPrivilege", payload: true });
        } else {
            dispatch({ type: "SET", key: "editPrivilege", payload: false });
        }
    }, [checkAdminPriv, dispatch, state.cur]);
    useEffect(() => {
        if (!checkAccess()) {
            setRedirectFlag(true);
        } else if (state.user) {
            checkEditPriv(state.user);
        }
    }, [checkAccess, checkEditPriv, state.user])

    const toSaveBtn = (ev) => {
        dispatch({ type: "SET", key: "saveButtonHit", payload: true });
    }

    if (code404) return <Code404 />
    if (redirectFlag) return <Redirect to="/characters" />
    if (!state.cur) return <LoadingAlert />
    return(
        <div className="primary-content content-padding char-sheet">
            <Prompt when={state.curChangesMade} message="Are you sure you want to leave? Unsaved changes may be lost." />
            <CharSheetMain />
            <div className="float-right rows">
                <div className="columns">
                    <MyButton fct={manualLoadFct}>Load Latest Version of Character</MyButton>
                    {match.url.split("/")[1] === "bestiary" ?
                        <MyLink to="/bestiary">Back to Bestiary</MyLink> :
                        <MyLink to="/characters">Back to Characters</MyLink>
                    }
                </div>
                <div className="columns">
                    {state.editPrivilege ? <MyButton fct={toSaveBtn}>Save Character</MyButton> : null}
                    {adminPrivilege ? <MyButton>Delete Character (TODO)</MyButton> : null}
                </div>
            </div>
        </div>
    )
}

export default CharSheetShell;