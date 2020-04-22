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
        document.querySelector("body").addEventListener('click', closeUserMenu);
        return () => {
            document.querySelector("body").removeEventListener('click', closeUserMenu);
        };
    }, [dispatch])

    return (
        <div className="profile signed-out">
            <img onClick={toggle} src={profileButton} alt="User Menu" className="blockclick-user-menu" />
            {state.userSettingsMenuOpen ?
                <nav>
                    <NavLink to="/login" className="blockclick-user-menu">Login</NavLink>
                    <NavLink to="/register" className="blockclick-user-menu">Register</NavLink>
                </nav> : null}
        </div>
    );
}

export default SignedOut;