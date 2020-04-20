import React, { useState, useEffect, useRef } from 'react';
import useGlobal from '../../hooks/useGlobal';

import { roll } from '../../helpers/roll';
import { ifPlus } from '../../helpers/Calculations';
import '../../css/game.css';

const RollsDisplay = () => {
    const [userInfo] = useGlobal("user");
    const [rolls] = useGlobal("rolls");
    const [displayArr, setDisplayArr] = useState([]);

    const scrollHeightRef = useRef(0);
    const clientHeightRef = useRef(0);
    useEffect(() => {
        const el = document.querySelector(".rolls-window div.scroll-window");
        scrollHeightRef.current = el.scrollHeight;
        clientHeightRef.current = el.clientHeight;
    }, [])

    useEffect(() => {
        if (rolls.processFlag) {
            rolls.array.filter(roll => !roll.processed)
                .forEach(rollObj => {
                    console.log(userInfo.uid);
                    console.log(rollObj);
                    // if campaign matches
                    setDisplayArr([
                        ...displayArr,
                        {
                            character: rollObj.character,
                            name: rollObj.name,
                            rollData: roll(rollObj.dieMode, rollObj.dieModBasic, rollObj.dieModsMisc, rollObj.coasting)
                        }
                    ]);
                });
        }
    }, [rolls])

    useEffect(() => {
        const el = document.querySelector(".rolls-window div.scroll-window");
        if (el.scrollTop + 1 >= scrollHeightRef.current - clientHeightRef.current) {     // Scroll bar WAS at bottom
            el.scrollTop = el.scrollHeight - el.clientHeight;                            // Set scroll bar to bottom again
        }
        scrollHeightRef.current = el.scrollHeight;
        clientHeightRef.current = el.clientHeight;

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
    }, [displayArr])

    return (
        <section className="sidebar-padding rolls-window">
            <h2>Dice Rolls</h2>
            <div className="scroll-window">
                {displayArr.map((rollDisplay, i) => {
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
                })}
            </div>
        </section>
    );
}

export default RollsDisplay;