import React, { useEffect, useRef } from 'react';
import useGlobal from '../../hooks/useGlobal';

const EditWrapper = (props) => {
    const [cur, setCur] = useGlobal("cur");
    const [, setToggleEditingFct] = useGlobal("toggleEditingFct");
    const [, setEditStatFct] = useGlobal("editStatFct");
    const [, setEscFormFct] = useGlobal("escFormFct");
    // const [currentInputs] = useGlobal("currentInputs");
    
    const firstLoad = useRef(true);
    useEffect(() => {
        if (firstLoad.current) {
            setEscFormFct((ev) => {
                if (ev.key && ev.key === "Escape") {
                    document.querySelectorAll(".popout-edit input").forEach(el => {
                        el.blur();
                    });
                    document.querySelectorAll(".popout-edit").forEach(el => {
                        el.classList.remove("meb-open");
                    });
                }
            });

            setToggleEditingFct((ev) => {
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
            });
        
            setEditStatFct((ev, savedInputs) => {
                const key = ev.target.id.split("_")[2];
                const valHolderId = `meb_editval_${key}`;
                const newVal = savedInputs[valHolderId];
                switch (key) {
                    default:
                        setCur({
                            ...cur,
                            [key]: newVal
                        });
                }
                document.getElementById(ev.target.id).classList.remove("meb-open");
            });
            
            firstLoad.current = false;
        }
    })

    return(
        <>
            {props.children}
        </>
    );
}

export default EditWrapper;