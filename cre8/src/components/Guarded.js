import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import useGlobal from '../hooks/useGlobal';

const Guarded = ({ children, ...rest }) => {

    const [userInfo] = useGlobal("user");

    let component = userInfo ? 
        <Route {...rest}>
            {children}
        </Route> : 
        <Redirect to="/login" />
    return (component);
}

export default Guarded;