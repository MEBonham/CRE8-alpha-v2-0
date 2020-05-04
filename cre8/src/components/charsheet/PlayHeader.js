import React, { useContext } from 'react';

import { Store } from '../GlobalWrapper';
import useFormGlobalScope from '../../hooks/useFormGlobalScope';
import MyButton from '../ui/MyButton';

const PlayHeader = () => {
    const [state, dispatch] = useContext(Store);
    const { handleInputChange, handleSubmit } = useFormGlobalScope(state.editCharFct, state.inputs, dispatch);

    return (
        <header>
            <h1>{state.cur.name}</h1>
            <div className="columns space-between">
                <h2 className="subtitle">Level {state.cur.stats.level} {state.cur.stats.epithet}</h2>
                {state.cur && state.cur.monster_flag ?
                    <div className="xp-award">
                        <span className="stat float-right bold">XP for Defeating: {state.cur.stats.xp_award}</span>
                    </div> :
                    <div className="columns xp-summary">
                        <span className="stat float-right bold">XP: {state.cur.stats.xp}</span>
                        <div className="xp-button float-right meb-contain-edit">
                            <MyButton fct={state.toggleCharEditing} evData="meb_togCharEdit_earnXp">Earn XP</MyButton>
                            <form className="meb-popout-edit" onSubmit={handleSubmit} id="meb_charEditForm_earnXp">
                                <input
                                    type="number"
                                    onChange={handleInputChange}
                                    id="meb_charEditVal_earnXp"
                                />
                                <button type="submit">Enter</button>
                            </form>
                        </div>
                        <span className="stat float-right bold">Next Level At: {state.cur.stats.next_level_at}</span>
                    </div>
                }
            </div>
        </header>
    );
}

export default PlayHeader;