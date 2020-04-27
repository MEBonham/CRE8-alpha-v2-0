import React, { useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Store } from '../GlobalWrapper';

import profileButton from '../../media/profile-icon.png';

const SignedOut = () => {
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

    return (
        <div className="profile signed-out">
            <img onClick={toggle} src={profileButton} alt="User Menu" />
            {state.userSettingsMenuOpen ?
                <nav>
                    <NavLink to="/login" className="blockclick-user-menu">Login</NavLink>
                    <NavLink to="/register" className="blockclick-user-menu">Register</NavLink>
                </nav> : null}
        </div>
    );
}

export default SignedOut;