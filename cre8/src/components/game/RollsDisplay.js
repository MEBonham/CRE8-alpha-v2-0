import React, { useEffect, useRef, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import MyButton from '../ui/MyButton';
import { ifPlus } from '../../helpers/Calculations';
import '../../css/game.css';

const RollsDisplay = () => {
    const [state, dispatch] = useContext(Store);
    const LS_KEY = "rollsToDisplay";

    // Load persisted rolls from local storage
    useEffect(() => {
        const tempVar = JSON.parse(localStorage.getItem(LS_KEY));
        dispatch({ type: "SET", key: "rollsToDisplay", payload: tempVar });
    }, [dispatch])

    // Save rolls to local storage for persistence
    useEffect(() => {
        localStorage.setItem(LS_KEY, JSON.stringify(state.rollsToDisplay));
    }, [state.rollsToDisplay]);

    // Clear displayed rolls
    const clearLsRolls = () => {
        dispatch({ type: "SET", key: "rollsToDisplay", payload: [] });
    }

    // Add incoming rolls to display set
    const rollsArrRef = useRef([]);
    useEffect(() => {
        const processRoll = () => {
            dispatch({ type: "SET", key: "rollsToDisplay", payload: rollsArrRef.current.concat([state.latestRoll]) });
        }
        if (state.latestRoll) {
            processRoll();
        }
    }, [dispatch, state.latestRoll])
    useEffect(() => {
        if (state.rollsToDisplay) {
            rollsArrRef.current = state.rollsToDisplay;
        }
    }, [state.rollsToDisplay])

    // Keep Dice Rolls window scrolled to bottom; style dice rolls display
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

        if (state.rollsToDisplay) {
            state.rollsToDisplay.forEach((roll, i) => {
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
    }, [state.rollsToDisplay])

    return(
        <section className="sidebar-padding rolls-outer-window">
            <h2>Dice Rolls</h2>
            <div ref={scrollWindow} className="rolls-inner-window">
                {state.rollsToDisplay ? state.rollsToDisplay.map((rollData, i) => {
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
                        <div className="roll-result rows">
                            <p className="big-num equals">=</p>
                            <p className="big-num bg">{rollData.resultData.result}</p>
                            {rollData.resultData.coastNote ? <p className="tiny">(coasting)</p> : null}
                        </div>
                    </div>);
                }) : null}
            </div>
            <div className="float-right">
                {state.user ? null : <MyButton fct={clearLsRolls}>Clear Dice Rolls</MyButton>}
            </div>
        </section>
    )
}

export default RollsDisplay;