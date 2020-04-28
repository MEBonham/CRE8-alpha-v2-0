import React, { Fragment, useState, useEffect, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import ConfigureKit from './ConfigureKit';
import ConfigureFeat from './ConfigureFeat';
import ConfigureTalent from './ConfigureTalent';

const ConfigureSpecials = () => {
    const [state] = useContext(Store);

    const [levelDivs, setLevelDivs] = useState([]);
    useEffect(() => {
        const levelDivsCopy = [];
        for (let i = 0; i < state.cur.stats.level; i++) {
            levelDivsCopy.push(
                <Fragment key={i}>
                    <label>Level {i + 1}:</label>
                    <div className="columns">
                        {i % 2 === 0 && i < 9 ? <ConfigureKit level={i} index={0} /> : null}
                        {i === 0 ? <ConfigureKit level={i} index={1} /> : null}
                        {i < 8 ? <ConfigureFeat level={i} index={0} /> : null}
                        <ConfigureTalent level={i} index={0} />
                        {i === 0 ? <>
                            <ConfigureTalent level={i} index={1}  />
                            <ConfigureTalent level={i} index={2} />
                            <ConfigureTalent level={i} index={3} />
                        </> : null}
                        {i === 0 ? <ConfigureTalent level={i} index={4} flaw /> : null}
                    </div>
                </Fragment>
            )
        }
        setLevelDivs(levelDivsCopy);
    }, [state.cur.stats.level])

    return (
        <section className="configure-specials rows">
            <h2>Special Abilities</h2>
            <div className="rows">
                {levelDivs}
            </div>
        </section>
    );
}

export default ConfigureSpecials;