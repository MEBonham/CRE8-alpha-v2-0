import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Context } from './GlobalWrapper';

const Guarded = ({ children, ...rest }) => {
    const [{ user }] = useContext(Context);
    // const [userInfo] = useGlobal("user");

    let component = user ? 
        <Route {...rest}>
            {children}
        </Route> : 
        <Redirect to="/login" />
    return (component);
}

export default Guarded;