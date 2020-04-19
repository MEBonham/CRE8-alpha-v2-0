import React from 'react';
import useGlobal from '../../hooks/useGlobal';

const Play = () => {
    const [cur] = useGlobal("cur");
    return(
        <>
            <header>
                <h1>{cur.name}</h1>
                <p>Play</p>
            </header>
        </>
    );
}

export default Play;