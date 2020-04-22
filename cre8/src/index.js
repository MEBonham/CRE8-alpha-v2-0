import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import GlobalWrapper from './components/GlobalWrapper';

import ListenerWrapper from './components/header/ListenerWrapper';
import App from './components/App';
import './css/index.css';

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <GlobalWrapper>
                <>
                    <ListenerWrapper />
                    <App />
                </>
            </GlobalWrapper>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);