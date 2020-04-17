import React, { useEffect, useRef } from 'react';
import { useLocation, Switch, Route } from 'react-router-dom';

import Header from './header/Header';
import Footer from './footer/Footer';

import '../css/App.css';

const App = () => {
    const { pathname } = useLocation();
    const scrollContainer = useRef(null);

    useEffect(() => {
        scrollContainer.current.scroll(0, 0);
    }, [pathname]);

    return (
        <div className="App">
            <Header />
            <div className="main-envelope">
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