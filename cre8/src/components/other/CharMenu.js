import React from 'react';
import { Link } from 'react-router-dom';

const CharMenu = () => {
    return(
        <div className="primary-content content-padding">
            <Link to="/characters/fred">Fred</Link>
        </div>
    )
}

export default CharMenu;