import React from 'react';

import PlayGeneralRolls from './PlayGeneralRolls';
import PlayHeader from './PlayHeader';
import PlayPools from './PlayPools';

const Play = () => {

    return (
        <header>
            <PlayHeader />
            <div className="columns space-between">
                <div className="pools-n-general rows">
                    <PlayPools />
                    <PlayGeneralRolls />
                </div>
            </div>
        </header>
    );
}

export default Play;