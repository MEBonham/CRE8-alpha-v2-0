import React from 'react';
import useGlobal from '../../hooks/useGlobal';

const BuildLibrary = () => {
    const [cur] = useGlobal("cur");
    return(
        <>
            <header>
                <h1>{cur.name}</h1>
                <p>BuildLibrary</p>
            </header>
        </>
    );
}

export default BuildLibrary;