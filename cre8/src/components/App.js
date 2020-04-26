import React, { useState, useEffect, useRef } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

import GlobalWrapper from './GlobalWrapper';
import Guarded from './auth/Guarded';
import ReverseGuarded from './auth/ReverseGuarded';
import StateLoader from './invisible/StateLoader';
import StateSaver from './invisible/StateSaver';
import RollerEngine from './invisible/RollerEngine';
import FctInitiator from './invisible/FctInitiator';
import Header from './header/Header';
import Footer from './footer/Footer';
import Home from './other/Home';
import NewCharForm from './newchar/NewCharForm';
import CharSheetShell from './charsheet/CharSheetShell';
import CharMenu from './other/CharMenu';
import UserSettings from './auth/UserSettings';
import ForgotPassword from './auth/ForgotPassword';
import Login from './auth/Login';
import Register from './auth/Register';
import RollsDisplay from './game/RollsDisplay';
import Code404 from './other/Code404';
import '../css/App.css';

const App = () => {
    const FOOTER_HEIGHT_PX = 21;
    const [styleObj, setStyleObj] = useState({ height: "700px" });
    useEffect(() => {
        const bodyHeight = document.querySelector("body").offsetHeight;
        const headerHeight = document.querySelector(".App > header").offsetHeight;
        setStyleObj({ height: `${bodyHeight - headerHeight - FOOTER_HEIGHT_PX}px` });
    }, [])

    const { pathname } = useLocation();
    const scrollContainer = useRef(null);
    useEffect(() => {
        scrollContainer.current.scroll(0, 0);
    }, [pathname]);

    return(
        <div className="App">
            <GlobalWrapper>
                <StateLoader />
                <StateSaver />
                <RollerEngine />
                <FctInitiator />
                <Header />
                <div className="main-envelope columns" style={styleObj}>
                    <div className="contents" ref={scrollContainer}>
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route path={["/index", "/index.html"]} component={Home} />
                            <Guarded path="/characters/new"><NewCharForm /></Guarded>
                            <Route path="/characters/:slug" component={CharSheetShell} />
                            <Route path="/characters" component={CharMenu} />
                            <Guarded path="/user/settings"><UserSettings /></Guarded>
                            <ReverseGuarded path="/login/forgot"><ForgotPassword /></ReverseGuarded>
                            <ReverseGuarded path="/login"><Login /></ReverseGuarded>
                            <ReverseGuarded path="/register"><Register /></ReverseGuarded>
                            <Route component={Code404} />
                        </Switch>
                    </div>
                    <div className="sidebar">
                        <RollsDisplay />
                    </div>
                </div>
                <Footer />
            </GlobalWrapper>
        </div>
    );
}

export default App;