import React, { useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';

import profileButton from '../../media/profile-icon.png';

const SignedIn = () => {
    const [state, dispatch] = useContext(Store);
    const toggle = (ev) => {
        dispatch({ type: "SET", key: "userSettingsMenuOpen", payload: !state.userSettingsMenuOpen });
    }
    useEffect(() => {
        const closeUserMenu = (ev) => {
            if (!ev.target.matches(".blockclick-user-menu")) {
                dispatch({ type: "SET", key: "userSettingsMenuOpen", payload: false });
            }
        }
        if (state.userSettingsMenuOpen) {
            document.querySelector("body").addEventListener('click', closeUserMenu);
        } else {
            document.querySelector("body").removeEventListener('click', closeUserMenu);
        }
    }, [dispatch, state.userSettingsMenuOpen])

    const handleLogout = async () => {
        await fb.auth.signOut();
        dispatch({ type: "SET", key: "userSettingsMenuOpen", payload: false });
    }

    return (
        <div className="profile signed-in">
            <img onClick={toggle} src={profileButton} alt="User Menu" />
            {state.userSettingsMenuOpen && state.user ?
                <nav>
                    <p className="blockclick-user-menu">{state.user.displayName}</p>
                    <NavLink to="/user/settings" className="blockclick-user-menu">Settings</NavLink>
                    <p onClick={handleLogout} className="logout blockclick-user-menu">Logout</p>
                </nav> : null}
        </div>
    );
}

export default SignedIn;