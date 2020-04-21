import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import useGlobal from '../../hooks/useGlobal';
import fb from '../../fbConfig';

import MainNav from './MainNav';
import SignedIn from './SignedIn';
import SignedOut from './SignedOut';

import loadingIcon from '../../media/loading-icon.png';
import '../../css/header.css';

const Header = () => {

    // const [userInfo] = useGlobal("user");

    const [profileComp, setProfileComp] = useState(
        <div className="profile loading">
            <img className="profile-button" src={loadingIcon} alt="Loading ..." />
        </div>
    );

    const [userInfo, setUserInfo] = useState(null);
    useEffect(() => {
        setUserInfo(fb.auth.currentUser);
    }, [])
    
    useEffect(() => {
        if (userInfo) {
            setProfileComp(<SignedIn />);
        } else {
            setProfileComp(<SignedOut />);
        }
    }, [ userInfo ]);

    return (
        <header className="main-page-header">
            <div className="banner-contents">
                <Link to="/"><h1>CRE8 Alpha</h1></Link>
                <div className="top-right-corner">
                    {profileComp}
                    <MainNav />
                </div>
            </div>
            <div className="dummy-space" />
        </header>
    );
}

export default Header;