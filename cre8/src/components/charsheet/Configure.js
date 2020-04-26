import React from 'react';

import ConfigureGoodSave from './ConfigureGoodSave';
import ConfigureHeader from './ConfigureHeader';
import ConfigureSublevelsBreakdown from './ConfigureSublevelsBreakdown';
import ConfigurePoolsBreakdown from './ConfigurePoolsBreakdown';
import ConfigureSkills from './ConfigureSkills';

const Configure = () => {

    return (
        <>
            <header>
                <ConfigureHeader />
                <ConfigureGoodSave />
                <section className="columns top-breakdowns">
                    <ConfigurePoolsBreakdown />
                    <ConfigureSublevelsBreakdown />
                </section>
            </header>
            <ConfigureSkills />
        </>
    );
}

export default Configure;