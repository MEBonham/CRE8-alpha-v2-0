import { useEffect, useContext } from 'react';
import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';

const StateHolder = () => {
    const [, dispatch] = useContext(Store);
    useEffect(() => {
        let unsubscribeAuth = fb.auth.onAuthStateChanged(user => {
            dispatch({ type: "SET", key: "user", payload: user });
        });
        return(() => {
            unsubscribeAuth();
        });
    }, [dispatch])

    return (null);
}

export default StateHolder;