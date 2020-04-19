import React from 'react';
import useGlobal from '../../hooks/useGlobal';
import useFormGlobalLink from '../../hooks/useFormGlobalLink';

const Configure = () => {
    const [cur] = useGlobal("cur");
    const [toggleEditing] = useGlobal("toggleEditingFct");
    const [editStat] = useGlobal("editStatFct");
    const [escFormFct] = useGlobal("escFormFct");
    const [currentInputs, setCurrentInputs] = useGlobal("currentInputs");

    const { handleInputChange, handleSubmit } = useFormGlobalLink(editStat, currentInputs, setCurrentInputs);

    return(
        <div className="right-padding" onKeyDown={escFormFct}>
            <header>
                <header>
                    <div className="meb-contain-edit">
                        <h1 className="char-sheet-name editable" onClick={toggleEditing} id="meb_tog_name">{cur.name}</h1>
                        <form className="meb-popout-edit" onSubmit={handleSubmit} id="meb_editform_name">
                            <input type="text" onChange={handleInputChange} id="meb_editval_name" />
                            <button type="submit">Enter</button>
                        </form>
                    </div>
                    <div className="column-envelope space-between">
                        <h2 className="subtitle">
                            <span className="float-left-element-space">Level {cur.stats.level}</span>
                            <span className="meb-contain-edit">
                                <span className="editable" onClick={toggleEditing} id="meb_tog_epithet">{cur.stats.epithet}</span>
                                <form className="meb-popout-edit" onSubmit={handleSubmit} id="meb_editform_epithet">
                                    <input type="text" onChange={handleInputChange} id="meb_editval_epithet" />
                                    <button type="submit">Enter</button>
                                </form>
                            </span>
                        </h2>
                        <div className="column-envelope">
                            <span className="meb-contain-edit stat float-right-element">
                                <span className="editable bold" onClick={toggleEditing} id="meb_tog_xpBase">
                                    Base XP: {cur.stats.xp_base}
                                </span>
                                <form className="meb-popout-edit" onSubmit={handleSubmit} id="meb_editform_xpBase">
                                    <input type="number" onChange={handleInputChange} id="meb_editval_xpBase" />
                                    <button type="submit">Enter</button>
                                </form>
                            </span>
                            <span className="stat float-right-element bold">XP: {cur.stats.xp}</span>
                            <span className="stat float-right-element bold">Next Level At: {cur.stats.next_level_at}</span>
                        </div>
                    </div>
                </header>
                <section className="column-envelope space-between">
                    <div className="pools-breakdown">
                        <div className="column-envelope breakdown">
                            <div className="fill-in">
                                <p className="big-num">{cur.stats.vp_max}</p>
                                <p className="caption">Vitality<br />Points</p>
                            </div>
                            <div className="equals-symbol">
                                =
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{2 * cur.stats.level_max8}</p>
                                <p className="caption">2x Level</p>
                            </div>
                            <div className="plus-symbol">
                                +
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{cur.stats.vp_kits_total}</p>
                                <p className="caption">Kits<br />boosts</p>
                            </div>
                            <div className="plus-symbol">
                                +
                            </div>
                            <div className="fill-in">
                                <p className="big-num">{cur.stats.fortitude_base_total}</p>
                                <p className="caption">Base<br />Fortitude</p>
                            </div>
                            <div className="plus-symbol">
                                +
                            </div>
                            <div>
                                <p className="big-num trailing-num">5</p>
                            </div>
                        </div>
                        <div>

                        </div>
                        <div>

                        </div>
                    </div>
                    <div className="row-envelope">
                        <div className="good-save">

                        </div>
                        <div className="sublevels-breakdown">

                        </div>
                    </div>
                </section>
            </header>
        </div>
    );
}

export default Configure;