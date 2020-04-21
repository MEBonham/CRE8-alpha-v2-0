import React, { useEffect, useRef, useContext } from 'react';
import { Context } from '../GlobalWrapper';

import { updateBaseXp } from '../../helpers/Calculations';

const EditWrapper = (props) => {
    const [state, dispatch] = useContext(Context);
    // const [cur, setCur] = useGlobal("cur");
    // const [, setToggleEditingFct] = useGlobal("toggleEditingFct");
    // const [, setEditStatFct] = useGlobal("editStatFct");
    // const [, setEscFormFct] = useGlobal("escFormFct");
    
    const firstLoad = useRef(true);
    useEffect(() => {
        if (firstLoad.current) {
            dispatch({ type: "SET", key: "escFormFct", payload: (ev) => {
                if (ev.key && ev.key === "Escape") {
                    document.querySelectorAll(".meb-popout-edit input").forEach(el => {
                        el.blur();
                    });
                    document.querySelectorAll(".meb-popout-edit").forEach(el => {
                        el.classList.remove("meb-open");
                    });
                }
            } });

            dispatch({ type: "SET", key: "toggleEditingFct", payload: (ev) => {
                const key = ev.target.id.split("_")[2];
                if (key) {
                    const valHolderId = `#meb_editform_${key}`;
                    const el = document.querySelector(valHolderId);
                    const prevClasses = el.classList;
                    if (prevClasses.contains("meb-open")) {
                        el.classList.remove("meb-open");
                    } else {
                        const otherOpen = document.querySelectorAll(".meb-open");
                        el.classList.add("meb-open");
                        el.querySelector(`#meb_editval_${key}`).focus();
    
                        let top = 1;
                        let prevSib = el.previousSibling;
                        while (prevSib) {
                            top += prevSib.clientHeight;
                            prevSib = prevSib.previousSibling;
                        }
                        el.style.top = `${top}px`;
                        el.style.left = `${(el.previousSibling.clientWidth - el.offsetWidth) / 2}px`;
                        otherOpen.forEach(openForm => {
                            openForm.classList.remove("meb-open");
                        });
                    }
                }
            } });
            
            firstLoad.current = false;
        }
    })

    // const setEditStatFctRef = useRef(setEditStatFct);
    // const setCurRef = useRef(setCur);
    useEffect(() => {
        const switchKey = (key, newVal) => {
            switch (key) {
                case "earnXp":
                    return {
                        ...state.cur,
                        stats: updateBaseXp({
                            ...state.cur.stats,
                            xp_base: Math.max(0, state.cur.stats.xp_base + parseInt(newVal))
                        })
                    }
                case "name":
                    return {
                        ...state.cur,
                        [key]: newVal
                    };
                case "xpBase":
                    return {
                        ...state.cur,
                        stats: updateBaseXp({
                            ...state.cur.stats,
                            xp_base: Math.max(0, newVal)
                        })
                    }
                default:
                    return {
                        ...state.cur,
                        stats: {
                            ...state.cur.stats,
                            [key]: newVal
                        }
                    };
            }
        }

        dispatch({ type: "SET", key: "editStatFct", payload: (ev, savedInputs) => {
            const key = ev.target.id.split("_")[2];
            const valHolderId = `meb_editval_${key}`;
            const newVal = savedInputs[valHolderId];
            dispatch({ type: "SET", key: "cur", payload: switchKey(key, newVal) });
            document.getElementById(ev.target.id).classList.remove("meb-open");
        } });
        // setEditStatFctRef.current((ev, savedInputs) => {
        //     setCurRef.current(switchKey(key, newVal));
        // });
    }, [dispatch, state.cur])

    return(
        <>
            {props.children}
        </>
    );
}

export default EditWrapper;