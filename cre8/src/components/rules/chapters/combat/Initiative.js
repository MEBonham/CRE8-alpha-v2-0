import React from 'react';
// import { Link } from 'react-router-dom';

import MyLink from '../../../ui/MyLink';

const Initiative = () => {
    return (
        <>
            <div className="float-right">
                <MyLink to="/rules">Back to Rules</MyLink>
            </div>
            <h1>Taking Turns: Initiative Order</h1>
            <section>
                <h2>Rounds of Combat</h2>
                <p>In combat, timing is divided into increments called <strong>rounds</strong>, which are supposed to represent approximately 10 seconds of time.</p>
                <p>Within a round, creatures take turns doing most of the things they do. Each creature gets one turn per round. The order in which their actions resolve is determined by their <strong>initiative order</strong>.</p>
            </section>
            <section>
                <h2>Rolling Initiative</h2>
                <p>At the start of a combat, each creature involved in the encounter makes a Reflex Save. The result of this Reflex Save is the creature's Initiative Value for the encounter. Within a round, combatants act in order, counting down from highest Initiative Values to lowest.</p>
                <p>When creatures roll initiative, they can also attempt a TN 20 Heroics Check to start the combat with momentum.</p>
            </section>
            <section>
                <h2>Variant: Group Initiative</h2>
                <p>Often a number of NPCs in a combat are identical creatures, with identical Reflex Saves. If the GM wishes, she can roll once for all of these creatures, who will then act next to each other in the Initiative Order.</p>
            </section>
            <section>
                <h2>Initiative Tiebreakers</h2>
                <p>If multiple creatures have the same Initiative Values, the creatures with the highest Reflex Save modifiers go first. (Equivalently, the creatures who rolled the <em>lowest</em> Natural Die Results on their Reflex saves go first.)</p>
                <p>If there is still a tie, resolve it randomly.</p>
            </section>
            <section>
                <h2>Only Relative Order Matters</h2>
                <p>Once Initiative Order has been determined, the CRE8 rules will not reference Initiative Values any further, so they can be ignored. The same Initiative Order will be used in every round of the combat encounter, unless some action taken changes the Order around.</p>
            </section>
            <section>
                <h2>Surprise</h2>
                <p>Determine if any combatants are surprised to be in combat. Generally, a creature is allowed a Perception check to avoid being surprised. Sometimes this check is so easy as to be impossible to fail, e.g. if a guard patrol hears something banging their door down for several rounds before the fight begins.</p>
                <p>If everyone in an encounter is surprised, nothing special happens, since they are all in an equal situation.</p>
                <p>If some combatants (but not all) are surprised, then the first round of combat will be a "surprise round." Surprised creatures, in addition to being off-guard against attacks, have their combat turns skipped during this round. Creatures who do get to act during a surprise round may only take a single action (of any type) on their turn.</p>
                <p>After the surprise round is over, all creatures cease being surprised, and creatures continue acting in Initiative Order with their full normal allotment of actions.</p>
            </section>
        </>
    );
}

export default Initiative;