import React from 'react';
// import { Link } from 'react-router-dom';

import MyLink from '../../../ui/MyLink';

const Retraining = () => {
    return (
        <>
            <div className="float-right">
                <MyLink to="/rules">Back to Rules</MyLink>
            </div>
            <h1>Character Retraining</h1>
            <p>
                You may freely re-select your character's Strongest Saving Throw, Skill Ranks, Special Abilities, and Specific Choices as long as three simple conditions are met:
                <ol className="inner">
                    <li>Your new build is a legal build, that would have been legal at all levels.</li>
                    <li>Sufficient in-game time has passed for your character to make the changes you wish.</li>
                    <li>None of the changes mandate changing the character's backstory without specific GM approval.</li>
                </ol>
            </p>
            <section>
                <h2>1. Legal Build</h2>
                <p>Be careful about qualifying for abilities' Prerequisites when you are Retraining. When you aren't building a character in order, level by level, it is easy to get this wrong. Remember that (after Level 1) talents must come after feats, which must come after kits. Also be careful about how early you have enough ranks in a skill to qualify for Prerequisites based on that skill.</p>
                <p>Your choices do <em>not</em> have to be "backwards-compatible" with the story. For example, a high-level character can retrain Heavy Armor Proficiency to be taken at Level 4 instead of Level 1, even if (in the campaign's story) they have been using heavy armor at Levels 1-3. This shouldn't be neccessary often, but you can do it if your desired build requires it.</p>
            </section>
            <section>
                <h2>2. In-Character Time Requirement</h2>
                <p>How much time is required for retraining is up to the GM. It can be as short as an Extended Rest for minor changes, like if you want to switch the order that two Talents were taken in your build. Or it can require <em>years</em>, like if your aging high-level warrior wants to forget their extensive fighting abilities to study magic instead.</p>
                <p>Story considerations can shorten retraining times. The classic example is when a character has a dramatic religious experience (especially if that makes them take up religion-related spellcasting abilities due to their new enlightenment).</p>
                <p>Some special abilities also let you ignore this requirement, letting you retrain abilities "immediately."</p>
            </section>
            <section>
                <h2>3. No Backstory Changes</h2>
                <p>This basically just prohibits changing your Race, your [Background] abilities, and your known Languages.</p>
                <p>The GM is free to approve exceptions to this rule, for example if a strange case of amnesia changes a character's known languages, or a powerful Ritual changes the character's Race permanently.</p>
            </section>
        </>
    );
}

export default Retraining;