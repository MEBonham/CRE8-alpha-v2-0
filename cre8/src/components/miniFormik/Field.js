import React, { useContext } from 'react';

import { FormFcts } from './Form';

const Field = ({ name, ...otherProps }) => {
    const [state] = useContext(FormFcts);

    return (
        <input
            type="text"
            name={name}
            onChange={state.handleInputChange}
            value={state.inputs[name] || ""}
        />
    );
}

export default Field;