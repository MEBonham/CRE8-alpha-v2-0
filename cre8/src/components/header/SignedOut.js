import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import profileButton from '../../media/profile-icon.png';

const SignedOut = () => {
    // const MILLISECOND_TOLERANCE = 20;
    let lastClick = Date.now();
    const [userSettingsMenuOpen, setUserSettingsMenuOpen] = useState(false);
    // const openMenu = (ev) => {
    //     if (Date.now() - lastClick > MILLISECOND_TOLERANCE) {
    //         setUserSettingsMenuOpen(true);
    //     }
    // }
    const toggle = (ev) => {
        setUserSettingsMenuOpen(!userSettingsMenuOpen);
    }

    useEffect(() => {
        const closeMenu = (ev) => {
            setUserSettingsMenuOpen(false);
            lastClick = Date.now();
        }

        document.querySelector('body').addEventListener('click', closeMenu);
        // return () => {
        //     document.querySelector('body').removeEventListener('click', closeMenu);
        // };
    }, [])

    return (
        <div className="profile signed-out">
        {/* <img onClick={openMenu} src={profileButton} alt="User Menu" /> */}
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