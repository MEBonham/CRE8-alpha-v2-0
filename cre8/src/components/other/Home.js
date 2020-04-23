import React from 'react';

import MyLink from '../ui/MyLink';

const Home = () => {
    return (
        <div className="primary-content content-padding home-page rows">
            <h1>Welcome!</h1>
            <p><MyLink to="/characters">Characters</MyLink></p>
        </div>
    );
}

export default Home;