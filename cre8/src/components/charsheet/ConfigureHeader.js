import React, { useContext } from 'react';

import { Store } from '../GlobalWrapper';
import useFormGlobalScope from '../../hooks/useFormGlobalScope';

const ConfigureHeader = () => {
    const [state, dispatch] = useContext(Store);
    const { handleInputChange, handleSubmit } = useFormGlobalScope(state.editCharFct, state.inputs, dispatch);

    return (
        <header>
            <div className="meb-contain-edit">
                <h1 onClick={state.toggleCharEditing} id="meb_togCharEdit_name" className="editable-text">{state.cur.name}</h1>
                <form className="meb-popout-edit" onSubmit={handleSubmit} id="meb_charEditForm_name">
                    <input type="text" onChange={handleInputChange} id="meb_charEditVal_name" />
                    <button type="submit">Enter</button>
                </form>
            </div>
            <div className="columns space-between">
                <h2 className="subtitle">
                    <span className="float-left">Level {state.cur.stats.level}</span>
                    <span className="meb-contain-edit">
                        <span onClick={state.toggleCharEditing} id="meb_togCharEdit_epithet"  className="editable-text">
                            {state.cur.stats.epithet}
                        </span>
                        <form className="meb-popout-edit" onSubmit={handleSubmit} id="meb_charEditForm_epithet">
                            <input type="text" onChange={handleInputChange} id="meb_charEditVal_epithet" />
                            <button type="submit">Enter</button>
                        </form>
                    </span>
                </h2>
                <div className="columns xp-summary">
                    <span className="meb-contain-edit stat float-right">
                        <span onClick={state.toggleCharEditing} id="meb_togCharEdit_xpBase" className="editable-text bold">
                            Base XP: {state.cur.stats.xp_base}
                        </span>
                        <form className="meb-popout-edit" onSubmit={handleSubmit} id="meb_charEditForm_xpBase">
                            <input type="number" onChange={handleInputChange} id="meb_charEditVal_xpBase" />
                            <button type="submit">Enter</button>
                        </form>
                    </span>
                    <span className="stat float-right bold">XP: {state.cur.stats.xp}</span>
                    <span className="stat float-right bold">Next Level At: {state.cur.stats.next_level_at}</span>
                </div>
            </div>
        </header>
    );
}

export default ConfigureHeader;