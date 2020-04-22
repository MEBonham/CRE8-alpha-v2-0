import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import menuButton from '../../media/hamburger-menu.png';

const MainNav = () => {
    const [navOpen, setNavOpen] = useState(false);
    const toggle = () => {
        setNavOpen(!navOpen);
    }

    return (
        <div className="nav-dropdown-system">
            <img onClick={toggle} src={menuButton} alt="Nav Menu" className="nav-toggle" />
            {navOpen ?
                <nav>
                    <NavLink to="/characters">Characters</NavLink>
                </nav> : null}
        </div>
    );
}

export default MainNav;