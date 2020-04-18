import React, { useState, useEffect } from 'react';
import fb from '../../fbConfig';

import AdminSettings from './Admin';

const Settings = () => {

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
            {ownRank === "admin" ? <AdminSettings ownId={ownId} /> : null}
        </div>
    );
}

export default Settings;