import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import profileButton from '../../media/profile-icon.png';

const SignedOut = () => {
    
    const [userSettingsMenuOpen, setUserSettingsMenuOpen] = useState(false);
    const toggle = () => {
        setUserSettingsMenuOpen(!userSettingsMenuOpen);
    }

    return (
        <div className="profile signed-out">
        <img onClick={toggle} src={profileButton} alt="User Menu" />
        {userSettingsMenuOpen ?
            <nav>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
            </nav> : null}
        </div>
    );
}

export default SignedOut;