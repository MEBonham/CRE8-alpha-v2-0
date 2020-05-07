import React, { useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Store } from '../GlobalWrapper';

import menuButton from '../../media/hamburger-menu.png';

const MainNav = () => {
    const [state, dispatch] = useContext(Store);
    const toggle = (ev) => {
        dispatch({ type: "SET", key: "mainNavMenuOpen", payload: !state.userSettingsMenuOpen });
    }

    useEffect(() => {
        const closeNavMenu = (ev) => {
            if (!ev.target.matches(".blockclick-nav-menu")) {
                dispatch({ type: "SET", key: "mainNavMenuOpen", payload: false });
            }
        }
        if (state.mainNavMenuOpen) {
            document.querySelector("body").addEventListener('click', closeNavMenu);
        } else {
            document.querySelector("body").removeEventListener('click', closeNavMenu);
        }
    }, [dispatch, state.mainNavMenuOpen])

    return (
        <div className="nav-dropdown-system">
            <img onClick={toggle} src={menuButton} alt="Nav Menu" className="nav-toggle" />
            {state.mainNavMenuOpen ?
                <nav>
                    <NavLink to="/characters" className="blockclick-nav-menu">Characters</NavLink>
                    <NavLink to="/bestiary" className="blockclick-nav-menu">Bestiary</NavLink>
                    <NavLink to="/library" className="blockclick-nav-menu">Library</NavLink>
                    <NavLink to="/rules" className="blockclick-nav-menu">Rules</NavLink>
                </nav> : null}
        </div>
    );
}

export default MainNav;