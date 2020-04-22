import React, { useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';

import MyButton from '../ui/MyButton';
import MainNav from './MainNav';
import loadingIcon from '../../media/loading-icon.png';
import '../../css/header.css';

const Header = () => {
    const [state] = useContext(Store);

    const [profileComp, setProfileComp] = useState(
        <div className="profile loading">
            <img src={loadingIcon} alt="Loading ..." />
        </div>
    );

    const handleLogout = () => {
        fb.auth.signOut();
    }

    return (
        <header>
            <div className="banner-contents columns">
                <Link to="/"><h1>CRE8 Alpha</h1></Link>
                <div className="top-right">
                    {profileComp}
                    <MainNav />
                </div>
                {state.user ? <MyButton fct={handleLogout}>Logout</MyButton> : <NavLink to="login">Login</NavLink>}
            </div>
            <div className="dummy-space" />
        </header>
    );
}

export default Header;