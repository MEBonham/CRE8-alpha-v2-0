import React, { useReducer, createContext } from 'react';

import Reducer from '../hooks/Reducer';


const keyShortcutsFct = (ev) => {
    if (ev.key && ev.key === "Escape") {
        document.querySelectorAll(".meb-popout-edit input").forEach(el => {
            el.blur();
        });
        document.querySelectorAll(".meb-popout-edit").forEach(el => {
            el.classList.remove("meb-open");
        });
    }
}

const toggleCharEditing = (ev) => {
    const field = ev.target.id.split("_")[2];
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
    activeTabs: {},
    characterCache: [],
    curChangesMade: false,
    dieRollMode: "normal",
    editPrivilege: false,
    initialMount: true,
    keyShortcutsFct,
    mainNavMenuOpen: false,
    shouldUpdateCharacterCache: true,
    toggleCharEditing,
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