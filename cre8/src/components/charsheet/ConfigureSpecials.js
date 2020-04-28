import React, { Fragment, useState, useContext, useEffect } from 'react';

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
                        {i % 2 === 0 && i < 9 ? <ConfigureKit /> : null}
                        {i === 0 ? <ConfigureKit /> : null}
                        {i < 8 ? <ConfigureFeat /> : null}
                        {i === 0 ? <>
                            <ConfigureTalent />
                            <ConfigureTalent />
                            <ConfigureTalent />
                        </> : null}
                        <ConfigureTalent />
                        {i === 0 ? <ConfigureTalent flaw /> : null}
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