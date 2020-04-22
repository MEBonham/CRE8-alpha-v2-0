import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Store } from '../GlobalWrapper';

const CharMenu = () => {
    const [, dispatch] = useContext(Store);
    // Close menu that presumably led you here
    useEffect(() => {
        dispatch({ type: "SET", key: "mainNavMenuOpen", payload: false });
    }, [dispatch])

    return(
        <div className="primary-content content-padding">
            <Link to="/characters/fred">Fred</Link>
        </div>
    )
}

export default CharMenu;