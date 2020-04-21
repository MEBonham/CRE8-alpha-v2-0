import React, { useContext } from 'react';
import Context from '../GlobalWrapper';

const BuildLibrary = () => {
    const [state] = useContext(Context);
    return(
        <>
            <header>
                <h1 className="char-sheet-name">{state.cur.name}</h1>
            </header>
        </>
    );
}

export default BuildLibrary;