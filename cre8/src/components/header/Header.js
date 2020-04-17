import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header>
            <div className="banner-contents">
                <Link to="/"><h1>CRE8 Alpha</h1></Link>
            </div>
            <div className="dummy-space" />
        </header>
    );
}

export default Header;