import React from 'react';
import MyLink from '../../../ui/MyLink';

const Conditions = () => {
    return (
        <>
            <div className="float-right">
                <MyLink to="/rules">Back to Rules</MyLink>
            </div>
            <h1>Conditions</h1>
            <p>This chapter is classified under Combat, when it will most frequently apply, but many Conditions can also apply outside of combat.</p>
            <section>
                <h2>Battered</h2>
                <p>A Battered creature cannot regain VP. If targeted by an effect that would otherwise restore VP, he may attempt a TN 20 Fortitude save to lose the Battered condition instead of regaining VP.</p>
            </section>
            <section>
                <h2>Dazed</h2>
                <p>A Dazed creature cannot make opportunity attacks or otherwise take opportunity actions. She does not threaten the area around her (e.g. cannot provide flanking). Attackers attacking her enjoy Combat Advantage. Any Perception checks she makes as a free action are dragged.</p>
            </section>
            <section>
                <h2>Dead</h2>
                <p>A Dead creature is an object, rather than a creature, as far as the rules are concerned. It cannot take actions, think, or be aware of its surroundings. Its soul gradually leaves its body, and it cannot benefit from healing unless an effect specifically targets a corpse.</p>
            </section>
            <section>
                <h2>Dropped</h2>
                <p>A Dropped creature is "out of the fight," Prone and Helpless. If a creature that is not Dying becomes Dropped, it also gains the Unconscious condition.</p>
                <p>A conscious Dropped character (i.e. one who is also Dying) may take the following actions:</p>
                <ul className="bullets">
                    <li>Go Unconscious as a free action. This is a tempting option, and it also makes some foes less likely to hit you again to finish you off.</li>
                    <li>Communicate with other creatures as a standard action. Any social skill checks made in this manner are dragged. Afterwards, the communicating creature falls Unconscious unless he succeeds on a TN 10 Fortitude or Willpower save.</li>
                    <li>Crawl 5 ft as a standard action. This movement provokes opportunity attacks. Afterwards, the crawling creature falls Unconscious unless he succeeds on a TN 15 Fortitude or Willpower save.</li>
                </ul>
            </section>
            <section>
                <h2>Dying</h2>
                <p>A Dying creature is also Wounded and Staggered, and cannot lose these conditions as long as it is Dying. A Dying creature that performs any strenuous actions (such as attacking, casting a spell, or hustling) muss pass a TN 15 Fortitude save or become Dropped.</p>
                <p>If a Dying creature is not Stable, she must attempt a TN 8 Heroics Check every 30 minutes. If this check fails, she dies. If the check passes TN 18, she becomes Stable for 6 hours.</p>
            </section>
            <section>
                <h2>Helpless</h2>
                <p>A Helpless creature is physically thoroughly unable to defend himself, and is therefore a valid target for a Coup de Grace attack.</p>
                <p>Besides being caused by other conditions (i.e. Dropped, Unconscious, or Paralyzed), Helpless can be caused by being very restrained physically, such as being thoroughly tied up.</p>
            </section>
            <section>
                <h2>Prone</h2>
                <p>A Prone creature moves as if everything were difficult terrain. He makes weapon attacks as if the weapon were improvised unless the weapon notes otherwise. Non-Prone creatures add +1d4 Impact to their melee attacks against Prone creatures.</p>
                <p>Being Prone can have advantages too. In particular, in many cases it can increase a creature's effective cover against ranged attacks.</p>
            </section>
            <section>
                <h2>Stable</h2>
                <p>A Stable creature need not make Heroics checks to survive, unlike other Dying creatures. If a creature loses the Dying condition, she also loses the Stable condition.</p>
            </section>
            <section>
                <h2>Staggered</h2>
                <p>A Staggered creature loses its normal Move Action each turn.</p>
            </section>
            <section>
                <h2>Stunned</h2>
                <p>A Stunned creature cannot take actions. He does not threaten the area around him (e.g. cannot provide flanking). Attackers attacking him enjoy Combat Advantage. Any Athletics, Dexterity, Gadgetry, Glibness, Knowledge, or Perception checks he makes reactively are dragged.</p>
            </section>
            <section>
                <h2>Unconscious</h2>
                <p>An Unconscious creature is Helpless, Prone, and Stunned. She automatically fails Athletics, Brawn, Dexterity, and Glibness checks unless the GM rules there is a special circumstance.</p>
            </section>
            <section>
                <h2>Wounded</h2>
                <p>A Wounded creature suffers a -2 penalty to all saving throws.</p>
            </section>
        </>
    );
}

export default Conditions;