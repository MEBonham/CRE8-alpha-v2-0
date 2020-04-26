import React from 'react';

// import fb from '../../fbConfig';
import useForm from '../../hooks/useForm';
import gc from '../../helpers/GameConstants';
// import gc from '../../helpers/GameConstants';
// import { kitDefault } from '../../helpers/Templates';

const BuildLibraryKits = () => {

    const saveNewKit = (ev) => {
        console.log(inputs);
    }
    
    const { inputs, handleInputChange, handleSubmit } = useForm(saveNewKit);
    return (
        <form onSubmit={handleSubmit} className="build-library">
            <div className="columns space-between">
                <div className="rows">
                    <h2>New Kit</h2>
                    <div className="rows">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            onChange={handleInputChange}
                            value={inputs.name || ""}
                            required
                        />
                    </div>
                    <div className="rows">
                        <label htmlFor="prereqs">Prerequisites</label>
                        <textarea
                            id="prereqs"
                            onChange={handleInputChange}
                            value={inputs.prereqs || ""}
                            rows="4"
                            cols="50"
                        />
                    </div>
                </div>
                <div>
                    <h3>Tags</h3>
                    <ul>
                        {gc.kit_tags.map((tag) => (
                            <li key={tag} className="checkbox-pair">
                                <input
                                    type="checkbox"
                                    id={`kitTag_checkbox_${tag}`}
                                    onChange={handleInputChange}
                                />
                                {tag}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>


        </form>
    );
}

export default BuildLibraryKits;