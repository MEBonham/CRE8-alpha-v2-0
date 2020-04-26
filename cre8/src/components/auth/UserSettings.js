import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';

import { Store } from '../GlobalWrapper';
import ManageCampaigns from '../other/ManageCampaigns';
import AdminSettings from './Admin';
import MyButton from '../ui/MyButton';

const UserSettings = () => {
    const [state, dispatch] = useContext(Store);
    // Close menu that presumably led you here
    useEffect(() => {
        dispatch({ type: "SET", key: "userSettingsMenuOpen", payload: false });
    }, [dispatch])

    // Clear displayed rolls
    const clearLsRolls = () => {
        dispatch({ type: "SET", key: "rollsToDisplay", payload: [] });
    }

    // If no user is signed in, redirect
    const [redirectFlag, setRedirectFlag] = useState(false);
    useEffect(() => {
        if (!state.user) {
            setRedirectFlag(true);
        }
    }, [state.user])

    const rankBadge = () => {
        switch (state.user.rank) {
            case "admin":
                return <section><p><strong>Rank:</strong> admin (highest)</p></section>;
            case "archon":
                return <section><p><strong>Rank:</strong> archon (intermediate)</p></section>;
            default:
                return null
        }
    }

    if (redirectFlag) return <Redirect to="/" />
    return(
        <div className="primary-content content-padding rows">
            <h1>User Settings</h1>
            {rankBadge()}
            <section className="settings-button-bank">
                <MyButton fct={clearLsRolls}>Clear Dice Rolls</MyButton>
            </section>
            <ManageCampaigns />
            {state.user && state.user.rank === "admin" ? <AdminSettings ownId={state.user.uid} /> : null}
        </div>
    );
}

export default UserSettings;