import React, { useState, useEffect, useRef, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import { ifPlus } from '../../helpers/Calculations';

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

    return(
        <section className="sidebar-padding rolls-outer-window">
            <h2>Dice Rolls</h2>
            <div className="rolls-inner-window">
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