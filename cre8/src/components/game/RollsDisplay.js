import React, { useState, useEffect, useRef, useContext } from 'react';
import { Context } from '../GlobalWrapper';
import fb from '../../fbConfig';

import { roll } from '../../helpers/roll';
import { ifPlus } from '../../helpers/Calculations';
import '../../css/game.css';

const RollsDisplay = () => {
    const [state] = useContext(Context);
    const db = fb.db;
    // const [userInfo] = useGlobal("user");

    const scrollHeightRef = useRef(0);
    const clientHeightRef = useRef(0);
    useEffect(() => {
        const el = document.querySelector(".rolls-window div.scroll-window");
        scrollHeightRef.current = el.scrollHeight;
        clientHeightRef.current = el.clientHeight;
    }, [])

    // const [displayArr, setDisplayArr] = useGlobal("rollsDisplayArray");
    const [displayArr, setDisplayArr] = useState([]);
    const displayArrRef = useRef(displayArr);
    // const [latestRoll] = useGlobal("latestRoll");
    // const [usersCampaigns] = useGlobal("usersCampaigns");
    const campaignMatch = (campIdsArr1, campIdsArr2) => {
        campIdsArr1.forEach(id => {
            if (campIdsArr2.includes(id)) return true;
        });
        return false;
    }
    useEffect(() => {
        if (state.latestRoll.dieMode) {
            if (!state.latestRoll.processedLocally) {
                const processedArr = (state.user) ? [
                    ...state.latestRoll.processedBy.slice(),
                    state.user.uid
                ] : state.latestRoll.processedBy.slice();
                const rollOnce = {
                    ...state.latestRoll,
                    processedLocally: true,
                    processedBy: processedArr,
                    rollData: roll(state.latestRoll.dieMode, state.latestRoll.dieModBasic, state.latestRoll.dieModsMisc, state.latestRoll.coasting)
                };
                db.collection("rolls").doc(state.latestRoll.id).set(rollOnce)
                    .then(() => {
                        setDisplayArr([
                            ...displayArrRef.current,
                            // ...displayArr,
                            {
                                ...rollOnce
                            }
                        ]);
                    })
                    .catch(err => {
                        console.log(err);
                        setDisplayArr([
                            ...displayArrRef.current,
                            // ...displayArr,
                            {
                                ...rollOnce
                            }
                        ]);
                    })
            } else if (state.user && state.activeCampaigns && state.latestRoll && !state.latestRoll.processedBy.includes(state.user.uid)) {
                if (campaignMatch(Object.keys(state.activeCampaigns), state.latestRoll.campaigns)) {
                    const processedArr = (state.user) ? [
                        ...state.latestRoll.processedBy.slice(),
                        state.user.uid
                    ] : state.latestRoll.processedBy.slice();
                    setDisplayArr([
                        ...displayArrRef.current,
                        // ...displayArr,
                        {
                            ...state.latestRoll,
                            processedBy: processedArr
                        }
                    ]);
                }
            }
        }
    }, [db, state.latestRoll, setDisplayArr, state.user, state.activeCampaigns])
    useEffect(() => {
        displayArrRef.current = displayArr;
    }, [displayArr])

    useEffect(() => {
        const el = document.querySelector(".rolls-window div.scroll-window");
        if (el.scrollTop + 1 >= scrollHeightRef.current - clientHeightRef.current) {     // Scroll bar WAS at bottom
            el.scrollTop = el.scrollHeight - el.clientHeight;                            // Set scroll bar to bottom again
        }
        scrollHeightRef.current = el.scrollHeight;
        clientHeightRef.current = el.clientHeight;

        if (displayArr) {
            displayArr.forEach((roll, i) => {
                if (roll.rollData.multRoll.length > 1) {
                    const elArr = document.querySelectorAll(`#meb_showRolls_${i} p.bg`);
                    let oneBold = false;
                    roll.rollData.multRoll.forEach((natDieRoll, j) => {
                        const el = elArr[j];
                        if (oneBold || natDieRoll !== roll.rollData.natRoll) {
                            el.style.opacity = 0.5;
                        } else {
                            oneBold = true;
                        }
                    });
                }
            });
        }
    }, [displayArr])

    return (
        <section className="sidebar-padding rolls-window">
            <h2>Dice Rolls</h2>
            <div className="scroll-window">
                {displayArr ? displayArr.map((rollDisplay, i) => {
                    return(<div key={i} className="roll-display">
                        <h3>{rollDisplay.character}<br />{rollDisplay.name}</h3>
                        <div className="column-envelope" id={`meb_showRolls_${i}`}>
                            {rollDisplay.rollData.multRoll.map((oneRoll, j) => (
                                <p key={j} className="big-num bg">{oneRoll}</p>
                            ))}
                            <p className="big-num">{`${ifPlus(rollDisplay.rollData.netMod)}${rollDisplay.rollData.netMod}`}</p>
                        </div>
                        <div className="column-envelope roll-result">
                            <p className="big-num equals">=</p>
                            <p className="big-num bg">{rollDisplay.rollData.result}</p>
                        </div>
                    </div>);
                }) : null}
            </div>
        </section>
    );
}

export default RollsDisplay;