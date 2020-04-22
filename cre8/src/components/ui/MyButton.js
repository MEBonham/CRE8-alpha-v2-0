import React from 'react';

const MyButton = (props) => {
    return(
        <div onClick={props.fct} className="my-button">
            <span id={props.evData}>{props.children}</span>
        </div>
    );
}

export default MyButton;