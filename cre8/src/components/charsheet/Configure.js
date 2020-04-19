import React from 'react';
import useGlobal from '../../hooks/useGlobal';
import useForm from '../../hooks/useForm';

const Configure = () => {
    const [cur, setCur] = useGlobal("cur");

    const toggleEditing = (ev) => {
        const key = ev.target.id.split("_")[2];
        const valHolderId = `#meb_editform_${key}`;
        const el = document.querySelector(valHolderId);
        const prevClasses = el.classList;
        if (prevClasses.contains("meb-open")) {
            el.classList.remove("meb-open");
        } else {
            const otherOpen = document.querySelectorAll(".meb-open");
            el.classList.add("meb-open");
            document.querySelector(`#meb_editval_${key}`).focus();
            otherOpen.forEach(openForm => {
                openForm.classList.remove("meb-open");
            });
        }
    }

    const editStat = (ev) => {
        const key = ev.target.id.split("_")[2];
        const valHolderId = `meb_editval_${key}`;
        const newVal = inputs[valHolderId];
        switch (key) {
            default:
                setCur({
                    ...cur,
                    [key]: newVal
                });
        }
        document.getElementById(ev.target.id).classList.remove("meb-open");
    }
    const { inputs, handleInputChange, handleSubmit } = useForm(editStat);

    return(
        <div className="right-padding">
            <header>
                <header>
                    <div className="contain-edit">
                        <h1 className="char-sheet-name editable" onClick={toggleEditing} id="meb_tog_name">{cur.name}</h1>
                        <form className="popout-edit" onSubmit={handleSubmit} id="meb_editform_name">
                            <input type="text" onChange={handleInputChange} id="meb_editval_name" />
                            <button type="submit">Enter</button>
                        </form>
                    </div>
                    <div className="column-envelope space-between">
                        <h2 className="subtitle">Level {cur.stats.level} <span className="editable">{cur.stats.epithet}</span></h2>
                        <div>
                            <span className="stat float-right-element editable"><strong>Base XP: {cur.stats.xp_base}</strong></span>
                            <span className="stat float-right-element"><strong>XP: {cur.stats.xp}</strong></span>
                            <span className="stat float-right-element"><strong>Next Level At: {cur.stats.nextLevelAt}</strong></span>
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
                                <p className="big-num">{2 * cur.stats.levelMax8}</p>
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