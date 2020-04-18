import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import fb from '../../fbConfig';

import profileButton from '../../media/profile-icon.png';

const SignedIn = () => {

    const delayMilliseconds = 50;
    let lastClick = Date.now();

    const [menuOpen, setMenuOpen] = useState(false);

    const toggle = () => {
        setMenuOpen(!menuOpen);
    }

    const clickToggle = (ev) => {
        if (Date.now() - lastClick >= delayMilliseconds) {
            lastClick = Date.now();
            toggle();
        }
    }

    const closeMenu = (ev) => {
        if (!ev.target.matches(".blockclick")) {
            setMenuOpen(false);
        }
    }

    useEffect(() => {
        document.querySelector('#root').addEventListener('click', closeMenu);
        return () => {
            document.querySelector('#root').removeEventListener('click', closeMenu);
        };
    }, [])

    const handleLogout = () => {
        fb.auth.signOut();
    }

    return(
        <div className="profile signedin">
            <img className="profile-button" onClick={clickToggle} src={profileButton} alt="User Menu" />
            {menuOpen ? 
                <nav>
                    <p className="blockclick">{fb.auth.currentUser.displayName}</p>
                    <NavLink to="/user/settings" className="blockclick">Settings</NavLink>
                    <p onClick={handleLogout} className="blockclick logout">Logout</p>
                </nav> : null}
        </div>
    );
}

export default SignedIn;