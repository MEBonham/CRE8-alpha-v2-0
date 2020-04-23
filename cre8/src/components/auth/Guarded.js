import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { Store } from '../GlobalWrapper';

const Guarded = ({ children, ...otherProps }) => {
    const [state] = useContext(Store);

    const component = state.user ? 
        <Route {...otherProps}>
            {children}
        </Route> : 
        <Redirect to="/login" />
    return (component);
}

export default Guarded;