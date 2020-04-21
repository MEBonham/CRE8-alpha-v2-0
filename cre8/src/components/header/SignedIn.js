import React, { useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Context } from '../GlobalWrapper';
import fb from '../../fbConfig';

import profileButton from '../../media/profile-icon.png';

const SignedIn = () => {
    const [{ userSettingsMenuOpen }, dispatch] = useContext(Context);
    const delaySeconds = 0.05;
    let lastClick = Date.now();

    // const [menuOpen, setMenuOpen] = useGlobal("userSettingsMenuOpen");

    const toggle = () => {
        dispatch({ type: "SET", key: "userSettingsMenuOpen", payload: !userSettingsMenuOpen });
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
                dispatch({ type: "SET", key: "userSettingsMenuOpen", payload: false });
            }
        }

        document.querySelector('#root').addEventListener('click', closeMenu);
        return () => {
            document.querySelector('#root').removeEventListener('click', closeMenu);
        };
    }, [dispatch])

    const handleLogout = () => {
        fb.auth.signOut();
    }

    return(
        <div className="profile signedin">
            <img className="profile-button blockclick" onClick={clickToggle} src={profileButton} alt="User Menu" />
            {(userSettingsMenuOpen && fb.auth.currentUser) ? 
                <nav>
                    <p className="blockclick">{fb.auth.currentUser.displayName}</p>
                    <NavLink to="/user/settings" className="blockclick">Settings</NavLink>
                    <p onClick={handleLogout} className="blockclick logout">Logout</p>
                </nav> : null}
        </div>
    );
}

export default SignedIn;