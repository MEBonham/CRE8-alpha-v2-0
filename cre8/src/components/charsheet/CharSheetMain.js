import React, {  } from 'react';
// import { Redirect, useParams } from 'react-router-dom';

// import { Store } from '../GlobalWrapper';
// import fb from '../../fbConfig';
// import Code404 from '../other/Code404';
// import LoadingAlert from '../other/LoadingAlert';
// import MyLink from '../ui/MyLink';
// import MyButton from '../ui/MyButton';
// import { charDefault } from '../../helpers/Templates';
// import CharSheetTabs from './CharSheetTabs';
// import EditWrapper from './EditWrapper';

const CharSheetMain = () => {

    const tabContents = () => {
        return null;
    }
    
    return(
        <div className="parchment">
            {/* <CharSheetTabs /> */}
            {/* <EditWrapper> */}
                {tabContents()}
            {/* </EditWrapper> */}
        </div>
    )
}

export default CharSheetMain;