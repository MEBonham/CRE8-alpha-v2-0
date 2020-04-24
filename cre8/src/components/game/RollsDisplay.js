import React, { useState, useEffect, useRef, useContext } from 'react';
import { Store } from '../GlobalWrapper';

const RollsDisplay = () => {
    const [state] = useContext(Store);

    const [rollsArr, setRollsArr] = useState([]);

    // const rollsArrRef = useRef(rollsArr);
    useEffect(() => {
        if (state.latestRoll) {
            console.log(state.latestRoll.resultData);
        }
    }, [state.latestRoll])
    // useEffect(() => {
    //     rollsArrRef.current = rollsArr;
    // }, [rollsArr])

    return(
        <section className="sidebar-padding rolls-outer-window">
            <h2>Dice Rolls</h2>
            <div className="rolls-inner-window">
                {/* {rollsArr.map((rollData, i) => (
                    <div key={i} className="oneRollWindow">
                        <p className="big-num">{rollData}</p>
                    </div>
                ))} */}
            </div>
        </section>
    )
}

export default RollsDisplay;