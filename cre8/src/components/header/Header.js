import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';

import MyButton from '../ui/MyButton';
import '../../css/header.css';

const Header = () => {
    const [state] = useContext(Store);

    const handleLogout = () => {
        fb.auth.signOut();
    }

    return (
        <header>
            <div className="banner-contents columns">
                <Link to="/"><h1>CRE8 Alpha</h1></Link>
                <NavLink to="/characters">Characters</NavLink>
                {state.user ? <MyButton fct={handleLogout}>Logout</MyButton> : <NavLink to="login">Login</NavLink>}
            </div>
            <div className="dummy-space" />
        </header>
    );
}

export default Header;