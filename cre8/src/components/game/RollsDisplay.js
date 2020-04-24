import React, { useState, useEffect, useRef, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import { ifPlus } from '../../helpers/Calculations';
import '../../css/game.css';

const RollsDisplay = () => {
    const [state] = useContext(Store);

    const [rollsArr, setRollsArr] = useState([]);

    const rollsArrRef = useRef(rollsArr);
    useEffect(() => {
        const processRoll = () => {
            setRollsArr([ ...rollsArrRef.current, state.latestRoll ]);
        }
        if (state.latestRoll) {
            processRoll();
        }
    }, [state.latestRoll])
    useEffect(() => {
        rollsArrRef.current = rollsArr;
    }, [rollsArr])

    const scrollHeightRef = useRef(0);
    const clientHeightRef = useRef(0);
    const scrollWindow = useRef(null);
    useEffect(() => {
        scrollHeightRef.current = scrollWindow.current.scrollHeight;
        clientHeightRef.current = scrollWindow.current.clientHeight;
    }, [])
    useEffect(() => {
        if (scrollWindow.current.scrollTop + 1 >= scrollHeightRef.current - clientHeightRef.current) {     // Scroll bar WAS at bottom
            scrollWindow.current.scrollTop = scrollWindow.current.scrollHeight - scrollWindow.current.clientHeight;    // Set scroll bar to bottom again
        }
        scrollHeightRef.current = scrollWindow.current.scrollHeight;
        clientHeightRef.current = scrollWindow.current.clientHeight;

        if (rollsArr) {
            rollsArr.forEach((roll, i) => {
                if (roll.resultData.multRoll.length > 1) {
                    const elArr = document.querySelectorAll(`#meb_showNatRolls_${i} p.bg`);
                    let oneBold = false;
                    roll.resultData.multRoll.forEach((natDieRoll, j) => {
                        const el = elArr[j];
                        if (oneBold || natDieRoll !== roll.resultData.natRoll) {
                            el.style.opacity = 0.5;
                        } else {
                            oneBold = true;
                        }
                    });
                }
            });
        }
    }, [rollsArr])

    return(
        <section className="sidebar-padding rolls-outer-window">
            <h2>Dice Rolls</h2>
            <div ref={scrollWindow} className="rolls-inner-window">
                {rollsArr ? rollsArr.map((rollData, i) => {
                    return(<div key={i} className="roll-display">
                        <h3>{rollData.character} <br />{rollData.name}</h3>
                        <div className="columns" id={`meb_showNatRolls_${i}`}>
                            {rollData.resultData.multRoll ?
                                rollData.resultData.multRoll.map((oneDie, j) => (
                                    <p key={j} className="big-num bg">{oneDie}</p>
                                )) :
                            null}
                            <p className="big-num">{`${ifPlus(rollData.resultData.netMod)}${rollData.resultData.netMod}`}</p>
                        </div>
                        <div className="column-envelope roll-result">
                            <p className="big-num equals">=</p>
                            <p className="big-num bg">{rollData.resultData.result}</p>
                        </div>
                    </div>);
                }) : null}
            </div>
        </section>
    )
}

export default RollsDisplay;