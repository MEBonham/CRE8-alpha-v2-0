import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store } from '../GlobalWrapper';

import MainNav from './MainNav';
import SignedIn from './SignedIn';
import SignedOut from './SignedOut';
import loadingIcon from '../../media/loading-icon.png';
import '../../css/header.css';

const Header = () => {
    const [state] = useContext(Store);

    const [profileComp, setProfileComp] = useState(
        <div className="profile loading">
            <img src={loadingIcon} alt="Loading ..." />
        </div>
    );
    useEffect(() => {
        if (state.user) {
            setProfileComp(<SignedIn />);
        } else {
            setProfileComp(<SignedOut />);
        }
    }, [state.user])

    return (
        <header>
            <div className="banner-contents columns">
                <Link to="/"><h1>CRE8 Alpha</h1></Link>
                <div className="top-right">
                    {profileComp}
                    <MainNav />
                </div>
            </div>
            <div className="dummy-space" />
        </header>
    );
}

export default Header;