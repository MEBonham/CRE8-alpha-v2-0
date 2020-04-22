import React from 'react';

import exIcon from '../../media/Wikimedia-external-site.png';

const MyExternalLink = ({ href, children, ...otherProps }) => {
    return(
        <div className="my-button external-link">
            <a href={href} { ...otherProps }>
                {children}
                <img src={exIcon} alt="(leave site)" />
            </a>
        </div>
    );
}

export default MyExternalLink;