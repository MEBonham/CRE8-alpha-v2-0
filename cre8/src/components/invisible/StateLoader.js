import { useEffect, useRef, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';

const StateLoader = () => {
    const [state, dispatch] = useContext(Store);
    const db = fb.db;
    
    // Subscribe to authorization changes
    useEffect(() => {
        let unsubscribeAuth = fb.auth.onAuthStateChanged(user => {
            dispatch({ type: "SET", key: "user", payload: user });
        });

        dispatch({ type: "SET", key: "initialMount", payload: false });

        return(() => {
            unsubscribeAuth();
        });
    }, [dispatch])

    // Pull active campaigns list from database; keep user rank in Store; load activeTabs
    const campaignsStream = useRef(null);
    const prevRank = useRef(null);
    useEffect(() => {
        if (state.user) {
            const collectUserInfo = async () => {
                try {
                    const doc = await db.collection("users").doc(state.user.uid).get();
                    dispatch({ type: "SET", key: "user", payload: {
                        ...state.user,
                        rank: doc.data().rank
                    } });
                } catch(err) {
                    console.log("Error:", err);
                }
            }
            if (!prevRank.current || state.user.rank !== prevRank.current) {
                prevRank.current = state.user.rank;
                collectUserInfo();
            }

            const loadActiveTabs = async () => {
                try {
                    const doc = await db.collection("activeTabs").doc(state.user.uid).get();
                    console.log(doc.data());
                    dispatch({ type: "SET", key: "activeTabs", payload: doc.data() });
                } catch(err) {
                    console.log("Error:", err);
                }
            }
            loadActiveTabs();

            campaignsStream.current = db.collection("campaigns")
                //.onSnapshot(querySnapshot => {
                .get().then(querySnapshot => {
                    const campaignsInfo = {};
                    // querySnapshot.filter() is not a function, I tried.
                    querySnapshot.forEach(campaign => {
                        if (campaign.data().members.includes(state.user.uid)) {
                            campaignsInfo[campaign.id] = campaign.data();
                        }
                    });
                    dispatch({ type: "SET", key: "activeCampaigns", payload: campaignsInfo });
                })
                .catch((err) => {
                    console.log("Error:", err);
                });
        } else {
            dispatch({ type: "SET", key: "activeCampaigns", payload: {
                standard: {},
                public: {}
            } });
        }
        // if (campaignsStream.current) {
        //     return (() => {
        //         campaignsStream.current();
        //     });
        // }
    }, [db, dispatch, state.user])

    // Watch db for new dice rolls
    const rollsStream = useRef(null);
    const uploadRef = useRef(null);
    useEffect(() => {
        uploadRef.current = state.uploadRoll;
    }, [state.uploadRoll])
    useEffect(() => {
        if (state.user) {
            rollsStream.current = db.collection("rolls")
                .onSnapshot(querySnapshot => {
                    querySnapshot.forEach(roll => {
                        // console.log(roll.data().processedBy);
                        if (!roll.data().processedBy.includes(state.user.uid)) {
                            uploadRef.current({
                                ...roll.data(),
                                id: roll.id
                            }, state.user.uid);
                            dispatch({ type: "ROLL_TO_QUEUE", local: false, payload: {
                                ...roll.data(),
                                id: roll.id
                            } });
                        }
                    });
                })
        }
    }, [db, dispatch, state.user])

    return (null);
}

export default StateLoader;