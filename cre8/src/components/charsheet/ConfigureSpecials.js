import React, { Fragment, useState, useEffect, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import ConfigureKit from './ConfigureKit';
import ConfigureFeat from './ConfigureFeat';
import ConfigureTalent from './ConfigureTalent';

const ConfigureSpecials = () => {
    const [state] = useContext(Store);

    const [parameters, setParameters] = useState({
        monster: state.cur.monster_flag,
        level_access: true
    });

    const [levelDivs, setLevelDivs] = useState([]);
    useEffect(() => {
        const levelDivsCopy = [];
        for (let i = 0; i < state.cur.stats.level; i++) {
            levelDivsCopy.push(
                <Fragment key={i}>
                    <label>Level {i + 1}:</label>
                    <div className="columns">
                        {i % 2 === 0 && i < 9 ? <ConfigureKit level={i} index={0} search={parameters} /> : null}
                        {i === 0 ? <ConfigureKit level={i} index={1} search={parameters} /> : null}
                        {i < 8 ? <ConfigureFeat level={i} index={0} search={parameters} /> : null}
                        <ConfigureTalent level={i} index={0} search={parameters} />
                        {i === 0 ? <>
                            <ConfigureTalent level={i} index={1} search={parameters} />
                            <ConfigureTalent level={i} index={2} search={parameters} />
                            <ConfigureTalent level={i} index={3} search={parameters} />
                        </> : null}
                        {i === 0 ? <ConfigureTalent level={i} index={4} search={parameters} flaw /> : null}
                    </div>
                </Fragment>
            )
        }
        setLevelDivs(levelDivsCopy);
    }, [parameters, state.cur.stats.level])

    const toggleMonsterFilter = (ev) => {
        setParameters({
            ...parameters,
            monster: ev.target.checked
        });
    }

    const toggleLevelAccessFilter = (ev) => {
        setParameters({
            ...parameters,
            level_access: ev.target.checked
        });
    }

    return (
        <section className="configure-specials rows">
            <h2>Special Abilities</h2>
            <header className="search-parameters columns">
                <div className="checkbox-pair">
                    <input
                        type="checkbox"
                        name="meb_searchMonsterTag"
                        onChange={toggleMonsterFilter}
                        defaultChecked={state.cur.monster_flag}
                    />
                    <label>Include [Monster] abilities</label>
                </div>
                <div className="checkbox-pair">
                    <input
                        type="checkbox"
                        name="meb_searchLevelAccessFilter"
                        onChange={toggleLevelAccessFilter}
                        defaultChecked={parameters.level_access}
                    />
                    <label>Filter by Accessibility at Level</label>
                </div>
            </header>
            <div className="rows">
                {levelDivs}
            </div>
        </section>
    );
}

export default ConfigureSpecials;