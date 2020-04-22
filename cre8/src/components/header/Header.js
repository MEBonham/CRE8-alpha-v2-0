import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {

    return (
        <header>
            <div class="banner-contents columns">
                <Link to="/"><h1>CRE8 Alpha</h1></Link>
                <NavLink to="/characters">Characters</NavLink>
            </div>
        </header>
    );
}

export default Header;