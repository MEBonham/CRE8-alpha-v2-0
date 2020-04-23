import React, { useContext } from 'react';
// import { Redirect, useParams } from 'react-router-dom';

import { Store } from '../GlobalWrapper';
// import fb from '../../fbConfig';
// import MyLink from '../ui/MyLink';
// import MyButton from '../ui/MyButton';
// import { charDefault } from '../../helpers/Templates';
import CharSheetTabs from './CharSheetTabs';
// import EditWrapper from './EditWrapper';
import Play from './Play';
import Configure from './Configure';
import Bio from './Bio';
import BuildLibrary from './BuildLibrary';

const CharSheetMain = () => {
    const [state] = useContext(Store);

    const tabContents = () => {
        if (state.cur) {
            const activeTabsCopy = {
                [state.cur.id]: (state.editPrivilege ? "configure" :"play"),
                ...state.activeTabs
            };
            switch (activeTabsCopy[state.cur.id]) {
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
        <div onKeyDown={state.escFormFct} className="parchment">
            <CharSheetTabs />
            <div className="parchment-padding">
                {/* <EditWrapper> */}
                    {tabContents()}
                {/* </EditWrapper> */}
            </div>
        </div>
    );
}

export default CharSheetMain;