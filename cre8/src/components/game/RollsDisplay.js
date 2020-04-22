import React, { useState, useEffect, useRef, useContext } from 'react';
import { Store } from '../GlobalWrapper';

const RollsDisplay = () => {
    const [state] = useContext(Store);

    const [rollsArr, setRollsArr] = useState([]);
    useEffect(() => {
        setRollsArr([1, 2, 3]);
    }, [])

    const rollsArrRef = useRef(rollsArr);
    useEffect(() => {
        if (state.latestRoll) {
            setRollsArr([
                ...rollsArrRef.current,
                state.latestRoll.slug
            ]);
        }
    }, [state.latestRoll])
    useEffect(() => {
        rollsArrRef.current = rollsArr;
    }, [rollsArr])

    return(
        <section className="sidebar-padding rolls-outer-window">
            <h2>Dice Rolls</h2>
            <div className="rolls-inner-window">
                {rollsArr.map((rollData, i) => (
                    <div key={i} className="oneRollWindow">
                        <p className="big-num">{rollData}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default RollsDisplay;