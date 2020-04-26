import React from 'react';

const RankButtonSystem = (props) => {
    const RANKS = ["peasant", "archon", "admin"];

    return (
        <div className="meb-contain-popout">
            <button onClick={props.toggle} id={`meb_openRanksButton_${props.index}`}>{props.datum.rank}</button>
            <div className={props.classes}>
                {RANKS.map(rankName => (
                    <button
                        onClick={props.setRank}
                        id={`meb_changeRank_${props.datum.id}_${rankName}_${props.index}`}
                        key={rankName}
                    >
                        {rankName}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default RankButtonSystem;