import { useEffect, useRef, useContext, useCallback } from 'react';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';

const StateHolder = () => {
    const [state, dispatch] = useContext(Store);
    
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

    // Pull active campaigns list from database
    const campaignsStream = useRef(null);
    useEffect(() => {
        if (state.user) {
            campaignsStream.current = fb.db.collection("campaigns")
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
    }, [dispatch, state.user])

    // Initialize EditCharacter global function
    const editCharFct = useCallback((ev, inputs) => {
        const ID_STUB = "meb_charEditVal";
        // Reset the editing form
        const field = ev.target.id.split("_")[2];
        const el = document.getElementById(`${ID_STUB}_${field}`);
        el.value = el.defaultValue;
        // Close the editing form
        document.getElementById(ev.target.id).classList.remove("meb-open");
        // Dispatch the change
        dispatch({ type: "CHAR_EDIT", field, inputs, stub: ID_STUB });
    }, [dispatch]);
    useEffect(() => {
        dispatch({ type: "SET", key: "editCharFct", payload: editCharFct });
    }, [dispatch, editCharFct])

    return (null);
}

export default StateHolder;