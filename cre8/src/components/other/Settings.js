import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../GlobalWrapper';
import fb from '../../fbConfig';

import ManageCampaigns from './ManageCampaigns';
import AdminSettings from './Admin';

const Settings = () => {
    const [{ settingsMenuOpen }, dispatch] = useContext(Context);
    const [ownId, setOwnId] = useState(null);
    const [ownRank, setOwnRank] = useState(null);
    useEffect(() => {
        let user = fb.auth.currentUser;
        if (user) {
            const docRef = fb.db.collection("users").doc(user.uid);
            docRef.get()
                .then((doc) => {
                    setOwnId(doc.id);
                    setOwnRank(doc.data().rank);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }, [])

    // const [menuOpen, setMenuOpen] = useGlobal("userSettingsMenuOpen");
    useEffect(() => {
        if (settingsMenuOpen) {
            dispatch({ type: "SET", key: "settingsMenuOpen", payload: false });
        }
    }, [dispatch, settingsMenuOpen])

    const rankBadge = () => {
        switch(ownRank) {
            case "admin":
                return <section><p><strong>Rank:</strong> admin (highest)</p></section>;
            case "archon":
                return <section><p><strong>Rank:</strong> archon (intermediate)</p></section>;
            default:
                return null
        }
    }

    return (
        <div className="normal-padding main">
            <h1>User Settings</h1>
            {rankBadge()}
            <ManageCampaigns />
            {ownRank === "admin" ? <AdminSettings ownId={ownId} /> : null}
        </div>
    );
}

export default Settings;