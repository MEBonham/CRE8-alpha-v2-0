import React from 'react';

import PlayConditions from './PlayConditions';
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
                <PlayConditions />
            </div>
        </header>
    );
}

export default Play;