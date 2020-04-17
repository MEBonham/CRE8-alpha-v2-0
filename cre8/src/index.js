import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import GlobalWrapper from './hooks/Store';

import App from './components/App';

import './css/index.css';

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <GlobalWrapper>
                <App />
            </GlobalWrapper>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);