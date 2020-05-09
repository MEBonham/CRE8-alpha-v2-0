import React from 'react';

const WealthRollDisplay = (props) => {
    const NUM_D6_DISPLAY = 18;
    const { d6history } = props.rollData.resultData;
    let rollsToShow;
    if (d6history.length > NUM_D6_DISPLAY) {
        rollsToShow = ["..."].concat(d6history.slice(d6history.length - NUM_D6_DISPLAY + 1));
    } else {
        rollsToShow = d6history;
    }
    return(
        <div className="wealth roll-display">
            <h3>{props.rollData.character} <br />{props.rollData.name}</h3>
            <div className="columns" id={`meb_showNatRollsWealth_${props.index}`}>
                {rollsToShow.map((oneDie, j) => (
                    <p key={j} className="big-num bg" style={ oneDie < 5 ? { opacity: "0.3" } : null }>{oneDie}</p>
                ))}
            </div>
            <div className="roll-result rows">
                <p className="big-num">{`${d6history.filter((d6) => (d6 > 4)).length} "successes"`}</p>
                <p className="big-num">{`New Wealth: ${props.rollData.resultData.finalWealth}`}</p>
            </div>
        </div>
    );
}

export default WealthRollDisplay;