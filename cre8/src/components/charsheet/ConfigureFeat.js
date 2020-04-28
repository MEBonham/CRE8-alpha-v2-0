import React, { useContext } from 'react';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';

const ConfigureFeat = (props) => {
    const [state] = useContext(Store);

    return (
        <div className="select-feat">
            <select>
                <option value="Select Feat">Select Feat</option>
            </select>
        </div>
    );
}

export default ConfigureFeat;