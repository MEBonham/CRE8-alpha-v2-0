import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Store } from '../GlobalWrapper';

const CharSheetMain = () => {
    const [, dispatch] = useContext(Store);
    const { slug } = useParams();
    const addSlug = (ev) => {
        dispatch({ type: "SET", key: "latestRoll", payload: { slug: slug } });
    }

    return(
        <div className="primary-content content-padding rows">
            <Link to="/characters">Back to character menu</Link>
            <button onClick={addSlug}>Add Slug</button>
        </div>
    )
}

export default CharSheetMain;