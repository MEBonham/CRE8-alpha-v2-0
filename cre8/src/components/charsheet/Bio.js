import React from 'react';
import useGlobal from '../../hooks/useGlobal';

const Bio = () => {
    const [cur] = useGlobal("cur");
    return(
        <>
            <header>
                <h1>{cur.name}</h1>
                <p>Bio</p>
            </header>
        </>
    );
}

export default Bio;