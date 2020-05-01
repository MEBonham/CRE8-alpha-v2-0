import React from 'react';
import { Link } from 'react-router-dom';

const MyLink = (props) => {
    const classes = props.className ? [ "my-button", props.className ].join(" ") : "my-button";
    return(
        <div className={classes}>
            <Link to={props.to}>{props.children}</Link>
        </div>
    );
}

export default MyLink;