import React, { useContext } from 'react';

import { Store } from '../GlobalWrapper';
import CharSheetTabs from './CharSheetTabs';
import Play from './Play';
import Configure from './Configure';
import Bio from './Bio';
import BuildLibrary from './BuildLibrary';

const CharSheetMain = () => {
    const [state] = useContext(Store);

    // Actually invoke the component that goes with the selected tab
    const tabContents = () => {
        if (state.cur) {
            switch (state.charSheetTab) {
                case "configure":
                    return <Configure />;
                case "bio":
                    return <Bio />;
                case "+library":
                    return <BuildLibrary />;
                default:
                    return <Play />;
            }
        } else {
            return null;
        }
    }
    
    return (
        <div className="parchment">
            <CharSheetTabs />
            <div className="parchment-padding">
                {tabContents()}
            </div>
        </div>
    );
}

export default CharSheetMain;