import React from 'react';
import useGlobal from '../../hooks/useGlobal';

const Bio = () => {
    const [cur] = useGlobal("cur");
    return(
        <>
            <header>
                <h1 className="char-sheet-name">{cur.name}</h1>
            </header>
        </>
    );
}

export default Bio;