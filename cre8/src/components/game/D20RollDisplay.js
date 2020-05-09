import React from 'react';

import { ifPlus } from '../../helpers/Calculations';

const D20RollDisplay = (props) => {
    return(
        <div className="d20 roll-display">
            <h3>{props.rollData.character} <br />{props.rollData.name}</h3>
            <div className="columns" id={`meb_showNatRollsD20_${props.index}`}>
                {props.rollData.resultData.multRoll ?
                    props.rollData.resultData.multRoll.map((oneDie, j) => (
                        <p key={j} className="big-num bg">{oneDie}</p>
                    )) :
                null}
                <p className="big-num">{`${ifPlus(props.rollData.resultData.netMod)}${props.rollData.resultData.netMod}`}</p>
            </div>
            <div className="roll-result rows">
                <p className="big-num equals">=</p>
                <p className="big-num bg">{props.rollData.resultData.result}</p>
                {props.rollData.resultData.coastNote ? <p className="tiny">(coasting)</p> : null}
            </div>
        </div>
    );
}

export default D20RollDisplay;