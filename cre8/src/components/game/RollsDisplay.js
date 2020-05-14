import React, { useEffect, useRef, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import MyButton from '../ui/MyButton';
import '../../css/game.css';
import D20RollDisplay from './D20RollDisplay';
import WealthRollDisplay from './WealthRollDisplay';

const RollsDisplay = () => {
    const [state, dispatch] = useContext(Store);
    const LS_KEY = "rollsToDisplay";

    // Load persisted rolls from local storage
    useEffect(() => {
        try {
            const tempVar = JSON.parse(localStorage.getItem(LS_KEY));
            dispatch({ type: "SET", key: "rollsToDisplay", payload: tempVar });
        } catch(err) {
            console.log(localStorage.getItem(LS_KEY));
            console.log(err.code);
        }
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
            for (let i = 0; i < state.rollsToDisplay.length; i++) {
                const roll = state.rollsToDisplay[i];
                if (roll.resultData.multRoll && roll.resultData.multRoll.length > 1) {
                    const elArr = document.querySelectorAll(`#meb_showNatRollsD20_${i} p.bg`);
                    let oneBold = false;
                    roll.resultData.multRoll.forEach((natDieRoll, j) => {
                        const el = elArr[j];
                        if (oneBold || natDieRoll !== roll.resultData.natRoll) {
                            el.style.opacity = 0.3;
                        } else {
                            oneBold = true;
                        }
                    });
                }
            }
        }
    }, [state.rollsToDisplay])

    return(
        <section className="rolls-outer-window">
            <h2>Dice Rolls</h2>
            <div ref={scrollWindow} className="rolls-inner-window">
                {state.rollsToDisplay ? state.rollsToDisplay.map((rollData, i) => {
                    if (rollData.type === "wealth roll") {
                        return <WealthRollDisplay key={i} index={i} rollData={rollData} />
                    } else {
                        return <D20RollDisplay key={i} index={i} rollData={rollData} />
                    }
                }) : null}
            </div>
            <div className="float-right">
                {state.user ? null : <MyButton fct={clearLsRolls}>Clear Dice Rolls</MyButton>}
            </div>
        </section>
    )
}

export default RollsDisplay;