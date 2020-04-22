import React from 'react';
import { Route, Switch } from 'react-router-dom';

import StateHolder from './other/StateHolder';
import Header from './header/Header';
import Home from './other/Home';
import CharSheetMain from './charsheet/CharSheetMain';
import CharMenu from './other/CharMenu';
import Login from './auth/Login';
import RollsDisplay from './game/RollsDisplay';

import '../css/App.css';
import GlobalWrapper from './GlobalWrapper';

const App = () => {

    return(
        <div className="App">
            <GlobalWrapper>
                <StateHolder />
                <Header />
                <div className="main-envelope columns">
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
            </GlobalWrapper>
        </div>
    );
}

export default App;