import React from 'react';

const Code404 = (props) => {
    if (props.from) console.log("From", props.from);
    return(
        <div className="primary-content content-padding code-404">
            <h1>You have navigated to a page that does not exist or cannot currently be loaded.</h1>
        </div>
    );
}

export default Code404;