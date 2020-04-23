import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import GlobalWrapper from './GlobalWrapper';

import Guarded from './auth/Guarded';
import ReverseGuarded from './auth/ReverseGuarded';
import StateHolder from './other/StateHolder';
import Header from './header/Header';
import Footer from './footer/Footer';
import Home from './other/Home';
import NewCharForm from './newchar/NewCharForm';
import CharSheetMain from './charsheet/CharSheetMain';
import CharMenu from './other/CharMenu';
import UserSettings from './auth/UserSettings';
import ForgotPassword from './auth/ForgotPassword';
import Login from './auth/Login';
import Register from './auth/Register';
import RollsDisplay from './game/RollsDisplay';

import '../css/App.css';

const App = () => {
    const FOOTER_HEIGHT_PX = 21;
    const [styleObj, setStyleObj] = useState({ height: "700px" });
    useEffect(() => {
        const bodyHeight = document.querySelector("body").offsetHeight;
        const headerHeight = document.querySelector(".App > header").offsetHeight;
        setStyleObj({ height: `${bodyHeight - headerHeight - FOOTER_HEIGHT_PX}px` });
    }, [])

    return(
        <div className="App">
            <GlobalWrapper>
                <StateHolder />
                <Header />
                <div className="main-envelope columns" style={styleObj}>
                    <div className="contents">
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route path={["/index", "/index.html"]} component={Home} />
                            <Guarded path="/characters/new"><NewCharForm /></Guarded>
                            <Route path="/characters/:slug" component={CharSheetMain} />
                            <Route path="/characters" component={CharMenu} />
                            <Guarded path="/user/settings"><UserSettings /></Guarded>
                            <ReverseGuarded path="/login/forgot"><ForgotPassword /></ReverseGuarded>
                            <ReverseGuarded path="/login"><Login /></ReverseGuarded>
                            <ReverseGuarded path="/register"><Register /></ReverseGuarded>
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