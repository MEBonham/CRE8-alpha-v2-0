import React, { useEffect, useRef } from 'react';
import useGlobal from '../../hooks/useGlobal';

const EditWrapper = (props) => {
    const [cur, setCur] = useGlobal("cur");
    const [, setToggleEditingFct] = useGlobal("toggleEditingFct");
    // const [clearedForEditing] = useGlobal("clearedForEditing");
    const [, setEditStatFct] = useGlobal("editStatFct");
    const [, setEscFormFct] = useGlobal("escFormFct");
    // const [currentInputs] = useGlobal("currentInputs");
    
    const firstLoad = useRef(true);
    // const clearedForEditingRef = useRef(false);
    useEffect(() => {
        if (firstLoad.current) {
            setEscFormFct((ev) => {
                if (ev.key && ev.key === "Escape") {
                    document.querySelectorAll(".meb-popout-edit input").forEach(el => {
                        el.blur();
                    });
                    document.querySelectorAll(".meb-popout-edit").forEach(el => {
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
                    // if (clearedForEditingRef.current) el.classList.add("meb-open");
                    el.classList.add("meb-open");
                    el.querySelector(`#meb_editval_${key}`).focus();

                    el.style.top = `${el.previousSibling.clientHeight + 1}px`;
                    el.style.left = `${(el.previousSibling.clientWidth - el.offsetWidth) / 2}px`;
                    otherOpen.forEach(openForm => {
                        openForm.classList.remove("meb-open");
                    });
                }
            });
            
            firstLoad.current = false;
        }
    })

    // useEffect(() => {
    //     clearedForEditingRef.current = clearedForEditing;
    // }, [clearedForEditing])

    const setEditStatFctRef = useRef(setEditStatFct);
    const setCurRef = useRef(setCur);
    useEffect(() => {
        console.log("flag");
        const switchKey = (key, newVal) => {
            switch (key) {
                case "name":
                    return {
                        ...cur,
                        [key]: newVal
                    };
                default:
                    return {
                        ...cur,
                        stats: {
                            ...cur.stats,
                            [key]: newVal
                        }
                    };
            }
        }

        setEditStatFctRef.current((ev, savedInputs) => {
            const key = ev.target.id.split("_")[2];
            const valHolderId = `meb_editval_${key}`;
            const newVal = savedInputs[valHolderId];
            setCurRef.current(switchKey(key, newVal));
            document.getElementById(ev.target.id).classList.remove("meb-open");
        });
    }, [cur])

    return(
        <>
            {props.children}
        </>
    );
}

export default EditWrapper;