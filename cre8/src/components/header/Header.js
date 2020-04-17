import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

import menuButton from '../../media/hamburger-menu.png';
import '../../css/header.css';

const Header = () => {

    const [menuOpen, setMenuOpen] = useState(false);
    const delayMilliseconds = 50;

    let lastClick = Date.now();

    const toggle = () => {
        setMenuOpen(!menuOpen);
    }

    const clickToggle = (ev) => {
        if (Date.now() - lastClick >= delayMilliseconds) {
            lastClick = Date.now();
            toggle();
        }
    }

    const closeMenu = (ev) => {
        if (!ev.target.matches(".blockclick")) {
            setMenuOpen(false);
        }
    }

    useEffect(() => {
        document.querySelector('#root').addEventListener('click', closeMenu);
        return () => {
            document.querySelector('#root').removeEventListener('click', closeMenu);
        };
    }, [])

    return (
        <header>
            <div className="banner-contents">
                <Link to="/"><h1>CRE8 Alpha</h1></Link>
                <div className="top-right-corner">
                    <div className="nav-dropdown">
                        <img className="nav-toggle" onClick={clickToggle} src={menuButton} alt="Nav Menu" />
                        {menuOpen ? 
                            <nav>
                                <NavLink to="/characters">Characters</NavLink>
                            </nav> : null}
                    </div>
                </div>
            </div>
            <div className="dummy-space" />
        </header>
    );
}

export default Header;