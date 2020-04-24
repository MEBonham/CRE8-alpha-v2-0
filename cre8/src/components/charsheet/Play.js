import React from 'react';

import PlayHeader from './PlayHeader';
import PlayPools from './PlayPools';

const Play = () => {

    return (
        <header>
            <PlayHeader />
            <div className="columns space-between">
                <div className="pools-n-general rows">
                    <PlayPools />
                </div>
            </div>
        </header>
    );
}

export default Play;