import { useEffect, useContext, useCallback } from 'react';

import { Store } from '../GlobalWrapper';

const FctInitiator = () => {
    const [state, dispatch] = useContext(Store);

    // Initialize EditCharacter global function
    const editCharFct = useCallback((ev, inputs) => {
        const ID_STUB = "meb_charEditVal";
        // Reset the editing form
        const field = ev.target.id.split("_")[2];
        const el = document.getElementById(`${ID_STUB}_${field}`);
        el.value = el.defaultValue;
        // Close the editing form
        document.getElementById(ev.target.id).classList.remove("meb-open");
        // Dispatch the change
        dispatch({ type: "CHAR_EDIT", field, inputs, stub: ID_STUB });
    }, [dispatch]);
    useEffect(() => {
        dispatch({ type: "SET", key: "editCharFct", payload: editCharFct });
    }, [dispatch, editCharFct])

    return (null);
}

export default FctInitiator;