import { useEffect, useContext, useCallback } from 'react';

import { Store } from '../GlobalWrapper';
import { rollDefault } from '../../helpers/Templates';

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

    // Initialize keyboard shortcuts (& block normal, conflicting keyboard shortcuts)
    const keyShortcutsFct = useCallback((ev) => {
        if (ev.key && ev.key === "Escape") {
            document.querySelectorAll(".meb-popout-edit input").forEach(el => {
                el.blur();
            });
            document.querySelectorAll(".meb-popout-edit").forEach(el => {
                el.classList.remove("meb-open");
            });
        } else if ((window.navigator.platform.match("Mac") ? ev.metaKey : ev.ctrlKey) && (ev.key === "s" || ev.key === "S") && !ev.altKey) {
            dispatch({ type: "SET", key: "saveButtonHit", payload: true });
        }
    }, [dispatch]);
    const blockShortcutKeysFct = useCallback((ev) => {
        if ((window.navigator.platform.match("Mac") ? ev.metaKey : ev.ctrlKey) && (ev.key === "s" || ev.key === "S") && !ev.altKey) {
            ev.preventDefault();
        }
    }, [])
    useEffect(() => {
        dispatch({ type: "SET", key: "keyShortcutsFct", payload: keyShortcutsFct });
        dispatch({ type: "SET", key: "blockShortcutKeysFct", payload: blockShortcutKeysFct });
    }, [blockShortcutKeysFct, dispatch, keyShortcutsFct])
    useEffect(() => {
        if (state.keyShortcutsFct) {
            document.addEventListener('keyup', state.keyShortcutsFct);
        }
        if (state.blockShortcutKeysFct) {
            document.addEventListener('keydown', state.blockShortcutKeysFct);
        }
    }, [state.blockShortcutKeysFct, state.keyShortcutsFct])

    // Initiate constructRollData function
    const constructRollData = useCallback(() => {
        const userStamp = state.user ? state.user.uid : "anon";
        return {
            ...rollDefault,
            id: `${Date.now()}-${userStamp}`,
            character: state.cur.name,
            campaigns: state.cur.campaigns
        };
    }, [state.cur, state.user]);
    useEffect(() => {
        dispatch({ type: "SET", key: "constructRollData", payload: constructRollData });
    }, [constructRollData, dispatch])

    return (null);
}

export default FctInitiator;