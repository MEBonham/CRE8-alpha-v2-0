import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Switch, Route } from 'react-router-dom';

import StateHolder from './StateHolder';
import Header from './header/Header';
import Footer from './footer/Footer';
import Guarded from './Guarded';
import Home from './other/Home';
import NewCharForm from './newchar/NewCharForm';
import CharSheetMain from './charsheet/CharSheetMain';
import CharMenu from './other/CharMenu';
import RollsDisplay from './game/RollsDisplay';
import ForgotPassword from './auth/ForgotPassword';
import Login from './auth/Login';
import Register from './auth/Register';
import Private from './auth/Private';
import Settings from './other/Settings';

import '../css/App.css';

const App = () => {

    useEffect(() => {
        console.log("rerendering");
    }, [])

    const firstLoad = useRef(true);
    const [bodyHeight, setBodyHeight] = useState(900);
    const [headerHeight, setHeaderHeight] = useState(200);
    const styleObj = {height: (bodyHeight - headerHeight - 21) + "px"};
    useEffect(() => {
        if (firstLoad.current) {
            setBodyHeight(document.querySelector("body").offsetHeight);
            setHeaderHeight(document.querySelector(".main-page-header").offsetHeight);

            firstLoad.current = false;
        }
    }, []);

    const { pathname } = useLocation();
    const scrollContainer = useRef(null);
    useEffect(() => {
        scrollContainer.current.scroll(0, 0);
    }, [pathname]);

    return (
        <div className="App">
            <StateHolder />
            <Header />
            <div className="main-envelope" style={styleObj}>
                <div className="main-contents" ref={scrollContainer}>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path={["/index", "/index.html"]} component={Home} />
                        <Guarded path="/characters/new"><NewCharForm /></Guarded>
                        <Route path="/characters/:slug" component={CharSheetMain} />
                        <Route path="/characters" component={CharMenu} />
                        <Route path="/login/forgot" component={ForgotPassword} />
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <Guarded path="/private"><Private /></Guarded>
                        <Guarded path="/user/settings"><Settings /></Guarded>
                    </Switch>
                </div>
                <div className="main-sidebar">
                    <RollsDisplay />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default App;