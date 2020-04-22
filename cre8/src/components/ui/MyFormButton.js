import React from 'react';

const MyFormButton = ({ children, evData, ...otherProps }) => {
    return(
        <button {...otherProps} className="my-button">
            <span id={evData}>{children}</span>
        </button>
    );
}

export default MyFormButton;