import React, { useReducer, createContext } from 'react';

import fb from '../fbConfig';
import Reducer from '../hooks/Reducer';

const uploadRoll = (roll, uid) => {
    const processedArr = [ ...roll.processedBy, uid ];
    const rollCopy = {
        ...roll,
        processedLocally: true,
        processedBy: processedArr
    }
    const { id } = rollCopy;
    delete rollCopy.id;
    fb.db.collection("rolls").doc(id).set(rollCopy);
}

const toggleCharEditing = (ev) => {
    const field = ev.currentTarget.id.split("_")[2];
    if (field) {
        const valHolderId = `meb_charEditForm_${field}`;
        const el = document.querySelector(`#${valHolderId}`);
        const prevClasses = el.classList;
        if (prevClasses.contains("meb-open")) {
            el.classList.remove("meb-open");
        } else {
            const otherOpen = document.querySelectorAll(".meb-open");
            el.classList.add("meb-open");
            el.querySelector(`#meb_charEditVal_${field}`).focus();

            let top = 1;
            let prevSib = el.previousSibling;
            while (prevSib) {
                top += prevSib.clientHeight;
                prevSib = prevSib.previousSibling;
            }
            el.style.top = `${top}px`;
            // el.style.left = `${(el.previousSibling.clientWidth - el.offsetWidth) / 2}px`;
            otherOpen.forEach(openForm => {
                openForm.classList.remove("meb-open");
            });
        }
    }
}

const initialData = {
    characterCache: [],
    curChangesMade: false,
    dieRollMode: "normal",
    editPrivilege: false,
    initialMount: true,
    mainNavMenuOpen: false,
    preview: {},
    rollQueue: [],
    rollsToDisplay: [],
    shouldUpdateCharacterCache: true,
    toggleCharEditing,
    uploadRoll,
    userSettingsMenuOpen: false
};

export const Store = createContext(initialData);

const GlobalWrapper = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialData);
    return (
        <Store.Provider value={[state, dispatch]}>
            {children}
        </Store.Provider>
    );
}

export default GlobalWrapper;