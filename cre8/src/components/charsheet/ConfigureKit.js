import React, { useContext } from 'react';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';

const ConfigureKit = (props) => {
    const [state] = useContext(Store);

    return (
        <div className="select-kit">
            <select>
                <option value="Select Kit">Select Kit</option>
            </select>
        </div>
    );
}

export default ConfigureKit;