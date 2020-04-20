import React, { useState, useEffect, useRef } from 'react';
import useGlobal from '../../hooks/useGlobal';

import { roll } from '../../helpers/roll';
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
    }, [displayArr])

    return (
        <section className="sidebar-padding rolls-window">
            <h2>Dice Rolls</h2>
            <div className="scroll-window">
                {displayArr.map((rollDisplay, i) => (
                    <div key={i} className="roll-display">
                        <h3>{rollDisplay.character}<br />{rollDisplay.name}</h3>
                        <p className="big-num">{rollDisplay.rollData.result}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default RollsDisplay;