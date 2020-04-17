import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Switch, Route } from 'react-router-dom';

import Header from './header/Header';
import Footer from './footer/Footer';

import '../css/App.css';

const App = () => {
    const { pathname } = useLocation();
    const scrollContainer = useRef(null);

    const [bodyHeight, setBodyHeight] = useState(900);
    const [headerHeight, setHeaderHeight] = useState(200);
    const styleObj = {height: (bodyHeight - headerHeight - 20) + "px"};

    useEffect(() => {
        scrollContainer.current.scroll(0, 0);
    }, [pathname]);

    useEffect(() => {
        setBodyHeight(document.querySelector("body").offsetHeight);
        setHeaderHeight(document.querySelector(".main-page-header").offsetHeight);
    }, []);

    return (
        <div className="App">
            <Header />
            <div className="main-envelope" style={styleObj}>
                <div className="main-contents" ref={scrollContainer}>
                    <Switch>

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