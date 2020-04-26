import React from 'react';
import { Link } from 'react-router-dom';

const MyLink = (props) => {
    return(
        <div className="my-button">
            <Link to={props.to}>{props.children}</Link>
        </div>
    );
}

export default MyLink;