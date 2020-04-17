import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Switch, Route } from 'react-router-dom';
import fb from '../fbConfig';
import useGlobal from '../hooks/useGlobal';

import Header from './header/Header';
import Footer from './footer/Footer';
import Guarded from './Guarded';
import Home from './Home';
import Login from './auth/Login';
import Register from './auth/Register';
import Private from './auth/Private';

import '../css/App.css';

const App = () => {
    const [, setUserInfo] = useGlobal("user");

    const { pathname } = useLocation();
    const scrollContainer = useRef(null);

    const [bodyHeight, setBodyHeight] = useState(900);
    const [headerHeight, setHeaderHeight] = useState(200);
    const styleObj = {height: (bodyHeight - headerHeight - 20) + "px"};

    useEffect(() => {
        scrollContainer.current.scroll(0, 0);
    }, [pathname]);

    useEffect(() => {
        fb.auth.onAuthStateChanged(user => {
            setUserInfo(user);
        });
        setBodyHeight(document.querySelector("body").offsetHeight);
        setHeaderHeight(document.querySelector(".main-page-header").offsetHeight);
    }, []);

    return (
        <div className="App">
            <Header />
            <div className="main-envelope" style={styleObj}>
                <div className="main-contents" ref={scrollContainer}>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path={["/index", "/index.html"]} component={Home} />
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <Guarded path="/private"><Private /></Guarded>
                    </Switch>
                </div>
                <div className="main-sidebar">

                </div>
            </div>
            <Footer />
        </div>
    );
}

export default App;