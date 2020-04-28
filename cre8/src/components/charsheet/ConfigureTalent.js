import React, { useContext } from 'react';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';

const ConfigureTalent = (props) => {
    const [state] = useContext(Store);

    return (
        <div className="select-talent">
            <select>
                <option value="Select Talent">Select Talent{props.flaw ? " (flaw)" : null}</option>
            </select>
        </div>
    );
}

export default ConfigureTalent;