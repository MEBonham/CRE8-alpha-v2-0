import React, { useContext } from 'react';

import { Store } from '../GlobalWrapper';

const Play = () => {
    const [state] = useContext(Store);

    return (
        <header>
            <header>
                <div className="meb-contain-edit">
                    <h1 onClick={state.toggleEditing} id="meb_tog_name">{state.cur.name}</h1>
                </div>
            </header>
        </header>
    );
}

export default Play;