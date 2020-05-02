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
                collectionCopy[item.id] = item.data().various_penalties ?
                    {
                        ...item.data()
                    } :
                    {
                        ...item.data(),
                        various_penalties: []
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

    return (
        <div className="main-content content-padding">
            <MyButton fct={editAll}>Edit All</MyButton>
        </div>

    );
}

export default BatchEdit;