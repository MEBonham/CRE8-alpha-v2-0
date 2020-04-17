import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import menuButton from '../../media/hamburger-menu.png';

const MainNav = () => {

    const delayMilliseconds = 50;
    let lastClick = Date.now();

    const [navOpen, setNavOpen] = useState(false);

    const toggle = () => {
        setNavOpen(!navOpen);
    }

    const clickToggle = (ev) => {
        if (Date.now() - lastClick >= delayMilliseconds) {
            lastClick = Date.now();
            toggle();
        }
    }

    const closeNav = (ev) => {
        if (!ev.target.matches(".blockclick")) {
            setNavOpen(false);
        }
    }

    useEffect(() => {
        document.querySelector('#root').addEventListener('click', closeNav);
        return () => {
            document.querySelector('#root').removeEventListener('click', closeNav);
        };
    }, [])

    return(
        <div className="nav-dropdown">
            <img className="nav-toggle" onClick={clickToggle} src={menuButton} alt="Nav Menu" />
            {navOpen ? 
                <nav>
                    <NavLink to="/characters">Characters</NavLink>
                </nav> : null}
        </div>
    );
}

export default MainNav;