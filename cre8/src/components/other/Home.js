import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return(
        <div className="normal-padding main">
            <h1>Welcome!</h1>
            <p><Link to="/characters">Characters</Link></p>
        </div>
    );
}

export default Home;