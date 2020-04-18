import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return(
        <div className="normal-padding main">
            <h1>Home</h1>
            <p><Link to="/private">Private Page</Link></p>
        </div>
    );
}

export default Home;