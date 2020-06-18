import React from 'react';

import fb from '../../fbConfig';
import MyButton from '../ui/MyButton';

const BatchEdit = () => {

    const collection = "kits";
    const editAll = async (ev) => {
        try {
            const collectionCopy = {};
            const query = await fb.db.collection(collection).get();
            query.forEach((item) => {
                // collectionCopy[item.id] = (Object.keys(item.data().stats.weapon_accuracy_mods)) ?
                // collectionCopy[item.id] = {
                collectionCopy[item.id] = (item.data().epic_to_awesome_boost) ? {
                    ...item.data()
                } : {
                    ...item.data(),
                    epic_to_awesome_boost: false
                };
            });
            Object.keys(collectionCopy).forEach((id) => {
                fb.db.collection(collection).doc(id).set({
                    ...collectionCopy[id]
                });
            })
        } catch(err) {
            console.log("Error:", err);
        }
    }

    const editAllChars = async (ev) => {
        try {
            const collectionCopy = {};
            const query = await fb.db.collection("characters").get();
            query.forEach((item) => {
                collectionCopy[item.id] = { ...item.data() };
                const abilities_clone = { ...collectionCopy[item.id].stats[collection] };
                Object.keys(abilities_clone).forEach((level) => {
                    Object.keys(abilities_clone[level]).forEach((index) => {
                        if (!abilities_clone[level][index].epic_to_awesome_boost) {
                            abilities_clone[level][index].epic_to_awesome_boost = false;
                        }
                    });
                });
                collectionCopy[item.id].stats[collection] = abilities_clone;
            });
            Object.keys(collectionCopy).forEach((id) => {
                fb.db.collection("characters").doc(id).set({
                    ...collectionCopy[id]
                });
            })
        } catch(err) {
            console.log("Error:", err);
        }
    }

    return (
        <div className="main-content content-padding">
            <MyButton fct={editAll}>Edit All</MyButton>
            <MyButton fct={editAllChars}>Edit All Characters</MyButton>
        </div>

    );
}

export default BatchEdit;