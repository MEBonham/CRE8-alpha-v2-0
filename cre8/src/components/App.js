import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';

import StateHolder from './other/StateHolder';
import Header from './header/Header';
import Footer from './footer/Footer';
import Home from './other/Home';
import CharSheetMain from './charsheet/CharSheetMain';
import CharMenu from './other/CharMenu';
import Login from './auth/Login';
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
            <StateHolder />
            <Header />
            <div className="main-envelope columns" style={styleObj}>
                <div className="contents">
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path={["/index", "/index.html"]} component={Home} />
                        <Route path="/characters/:slug" component={CharSheetMain} />
                        <Route path="/characters" component={CharMenu} />
                        <Route path="/login" component={Login} />
                    </Switch>
                </div>
                <div className="sidebar">
                    <RollsDisplay />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default App;