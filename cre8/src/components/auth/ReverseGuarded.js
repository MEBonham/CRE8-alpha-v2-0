import React, { useState, useEffect, useRef, useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { Store } from '../GlobalWrapper';
import LoadingAlert from '../other/LoadingAlert';

const ReverseGuarded = ({ children, destination, ...otherProps }) => {
    const [state] = useContext(Store);
    const initialMountRef = useRef(state.initialMount);

    const [loading, setLoading] = useState(true);
    const sleep = (milliseconds) => {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
    }
    useEffect(() => {
        let _isMounted = true;
        if (initialMountRef.current) {
            const wait = async (milliseconds=1500) => {
                await sleep(milliseconds);
                if (_isMounted) {
                    setLoading(false);
                }
            }
            wait(700);
        } else if (_isMounted) {
            setLoading(false);
        }
        return (() => {
            _isMounted = false;
        });
    }, [])

    if (loading) return <LoadingAlert />;
    if (!state.user) return (
        <Route {...otherProps}>
            {children}
        </Route>
    );
    return <Redirect to={destination || "/"} />;
}

export default ReverseGuarded;