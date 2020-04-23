import React, { useState, useEffect, useContext } from 'react';
import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';

import ManageCampaigns from '../other/ManageCampaigns';
import AdminSettings from './Admin';

const UserSettings = () => {
    const [state, dispatch] = useContext(Store);
    // Close menu that presumably led you here
    useEffect(() => {
        dispatch({ type: "SET", key: "userSettingsMenuOpen", payload: false });
    }, [dispatch])

    const [userInfo, setUserInfo] = useState({});
    useEffect(() => {
        const collectUserInfo = async () => {
            try {
                const doc = await fb.db.collection("users").doc(state.user.uid).get();
                setUserInfo({
                    ...doc.data(),
                    id: doc.id
                });
            } catch(err) {
                console.log("Error:", err);
            }
        }
        if (state.user) {
            collectUserInfo();
        }
    }, [state.user])

    const rankBadge = () => {
        switch (userInfo.rank) {
            case "admin":
                return <section><p><strong>Rank:</strong> admin (highest)</p></section>;
            case "archon":
                return <section><p><strong>Rank:</strong> archon (intermediate)</p></section>;
            default:
                return null
        }
    }

    return(
        <div className="primary-content content-padding rows">
            <h1>User Settings</h1>
            {rankBadge()}
            <ManageCampaigns />
            {userInfo && userInfo.rank === "admin" ? <AdminSettings ownId={userInfo.id} /> : null}
        </div>
    );
}

export default UserSettings;