import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import fb from '../../fbConfig';
import useGlobal from '../../hooks/useGlobal';

import profileButton from '../../media/profile-icon.png';

const SignedIn = () => {

    const delaySeconds = 0.05;
    let lastClick = Date.now();

    const [menuOpen, setMenuOpen] = useGlobal("userSettingsMenuOpen");

    const toggle = () => {
        setMenuOpen(!menuOpen);
    }

    const clickToggle = (ev) => {
        if (Date.now() - lastClick >= delaySeconds) {
            lastClick = Date.now();
            toggle();
        }
    }

    useEffect(() => {
        const closeMenu = (ev) => {
            if (!ev.target.matches(".blockclick")) {
                setMenuOpen(false);
            }
        }

        document.querySelector('#root').addEventListener('click', closeMenu);
        return () => {
            document.querySelector('#root').removeEventListener('click', closeMenu);
        };
    }, [setMenuOpen])

    const handleLogout = () => {
        fb.auth.signOut();
    }

    return(
        <div className="profile signedin">
            <img className="profile-button blockclick" onClick={clickToggle} src={profileButton} alt="User Menu" />
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