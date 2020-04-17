import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import profileButton from '../../media/profile-icon.png';

const SignedOut = () => {

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

    return(
        <div className="profile signedout">
            <img className="profile-button" onClick={clickToggle} src={profileButton} alt="User Menu" />
            {menuOpen ? 
                <nav>
                    <NavLink to="/login">Login</NavLink>
                    <NavLink to="/register">Register</NavLink>
                </nav> : null}
        </div>
    );
}

export default SignedOut;