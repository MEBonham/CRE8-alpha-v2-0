import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';

import profileButton from '../../media/profile-icon.png';

const SignedIn = () => {
    const [state] = useContext(Store);

    const [userSettingsMenuOpen, setUserSettingsMenuOpen] = useState(false);
    const toggle = () => {
        setUserSettingsMenuOpen(!userSettingsMenuOpen);
    }

    const handleLogout = () => {
        fb.auth.signOut();
    }

    return (
        <div className="profile signed-in">
            <img onClick={toggle} src={profileButton} alt="User Menu" />
            {(userSettingsMenuOpen && state.user) ?
                <nav>
                    <p>{state.user.displayName}</p>
                    <NavLink to="/user/settings">Settings</NavLink>
                    <p onClick={handleLogout} className="logout">Logout</p>
                </nav> : null}
        </div>
    );
}

export default SignedIn;