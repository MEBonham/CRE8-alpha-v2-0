import React, { useContext } from 'react';
import Context from '../GlobalWrapper';

const Bio = () => {
    const [state] = useContext(Context);
    // const [cur] = useGlobal("cur");
    return(
        <>
            <header>
                <h1 className="char-sheet-name">{state.cur.name}</h1>
            </header>
        </>
    );
}

export default Bio;