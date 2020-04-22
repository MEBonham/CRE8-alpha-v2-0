import React, { useContext } from 'react';
import { Store } from '../GlobalWrapper';

import Listener from './Listener';

const ListenerWrapper = () => {
    const [, dispatch] = useContext(Store);
    const closeUserMenu = (ev) => {
        dispatch({ type: "SET", key: "userSettingsMenuOpen", payload: false });
        // lastClick.current = Date.now();
    }
    
    return (
        <Listener fct={closeUserMenu} queryString="body" />
    );
}

export default ListenerWrapper;