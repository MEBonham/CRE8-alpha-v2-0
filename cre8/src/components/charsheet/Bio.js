import React, { useEffect, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import useFormGlobalScope from '../../hooks/useFormGlobalScope';

const Bio = () => {
    const [state, dispatch] = useContext(Store);
    const { handleInputChange, handleSubmit } = useFormGlobalScope(state.editCharFct, state.inputs, dispatch);

    const subjectsArr = (state.cur && state.cur.monster_flag) ?
        [
            {
                title: "Appearance & Physical Features",
                code: "appearance"
            },
            {
                title: "Personality, Motivations, & Mentality",
                code: "personality"
            },
            {
                title: "Habitat, Ecology, and Role",
                code: "ecology"
            },
            {
                title: "Combat Tactics",
                code: "tactics"
            },
            {
                title: "Quirks & Miscellaneous",
                code: "quirks"
            }
        ] :
        [
            {
                title: "Appearance & Physical Features",
                code: "appearance"
            },
            {
                title: "Summary of Personality",
                code: "personality"
            },
            {
                title: "Motivations & Beliefs",
                code: "beliefs"
            },
            {
                title: "Personal History",
                code: "background"
            },
            {
                title: "Relationships",
                code: "relationships"
            },
            {
                title: "Tastes, Quirks, & Miscellaneous",
                code: "quirks"
            },
            {
                title: "Non-Carried Property",
                code: "possessions"
            }
        ];

    useEffect(() => {
        document.querySelectorAll("section.bio-div textarea").forEach((textarea) => {
            const field = textarea.id.split("_")[2];
            textarea.value = state.cur.bio[field];
        });
    }, [state.cur.bio])

    return (
        <>
            <header>
                <header>
                    <div className="meb-contain-edit">
                        <h1 onClick={state.toggleCharEditing} id="meb_togCharEdit_name" className="editable-text">{state.cur.name}</h1>
                        <form className="meb-popout-edit" onSubmit={handleSubmit} id="meb_charEditForm_name">
                            <input type="text" onChange={handleInputChange} id="meb_charEditVal_name" />
                            <button type="submit">Enter</button>
                        </form>
                    </div>
                    <h2 className="subtitle">Level {state.cur.stats.level} {state.cur.stats.epithet}</h2>
                </header>
            </header>
            {subjectsArr.map((subjectObj) => (
                <section className="meb-contain-edit bio-div" key={subjectObj.code}>
                    <div onClick={state.toggleCharEditing} id={`meb_togCharEdit_${subjectObj.code}`} className="editable-text">
                        <h2>{subjectObj.title}</h2>
                        <p>{state.cur.bio[subjectObj.code]}</p>
                    </div>
                    <form className="meb-popout-edit rows" onSubmit={handleSubmit} id={`meb_charEditForm_${subjectObj.code}`}>
                        <textarea onChange={handleInputChange} id={`meb_charEditVal_${subjectObj.code}`} rows="4" cols="54" />
                        <button type="submit">Enter</button>
                    </form>
                </section>
            ))}
        </>
    );
}

export default Bio;