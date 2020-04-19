import React from 'react';
import useGlobal from '../../hooks/useGlobal';

const Configure = () => {
    const [cur] = useGlobal("cur");
    return(
        <>
            <header>
                <h1>{cur.name}</h1>
                <p>Configure</p>
            </header>
        </>
    );
}

export default Configure;