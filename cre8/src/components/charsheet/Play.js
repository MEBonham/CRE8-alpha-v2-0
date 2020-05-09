import React from 'react';

import PlayAccordions from './PlayAccordions';
import PlayConditions from './PlayConditions';
import PlayEquipment from './PlayEquipment';
import PlayGeneralRolls from './PlayGeneralRolls';
import PlayHeader from './PlayHeader';
import PlayPools from './PlayPools';
import PlaySkills from './PlaySkills';

const Play = () => {

    return (
        <>
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
            <div className="columns">
                <PlaySkills />
                <PlayAccordions />
            </div>
            <PlayEquipment />
        </>
    );
}

export default Play;