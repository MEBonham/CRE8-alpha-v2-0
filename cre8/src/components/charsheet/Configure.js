import React, { useContext } from 'react';

import { Store } from '../GlobalWrapper';
import useForm from '../../hooks/useForm';

const Configure = () => {
    const [state, dispatch] = useContext(Store);
    const ID_STUB = "meb_charEditVal";

    const editChar = (ev) => {
        // Reset the editing form
        const field = ev.target.id.split("_")[2];
        const el = document.getElementById(`${ID_STUB}_${field}`);
        el.value = el.defaultValue;
        // Close the editing form
        document.getElementById(ev.target.id).classList.remove("meb-open");
        // Dispatch the change
        dispatch({ type: "CHAR_EDIT", field, inputs, stub: ID_STUB });
    }
    const { inputs, handleInputChange, handleSubmit } = useForm(editChar);

    return (
        <header>
            <header>
                <div className="meb-contain-edit">
                    <h1 onClick={state.toggleCharEditing} id="meb_togCharEdit_name" className="editable-text">{state.cur.name}</h1>
                    <form className="meb-popout-edit" onSubmit={handleSubmit} id="meb_charEditForm_name">
                        <input type="text" onChange={handleInputChange} id="meb_charEditVal_name" />
                        <button type="submit">Enter</button>
                    </form>
                </div>
            </header>
        </header>
    );
}

export default Configure;