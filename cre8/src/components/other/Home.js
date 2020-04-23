import React from 'react';

import MyLink from '../ui/MyLink';

const Home = () => {
    return (
        <div className="primary-content content-padding home-page rows">
            <h1>Welcome!</h1>
            <MyLink to="/characters">Characters</MyLink>
        </div>
    );
}

export default Home;