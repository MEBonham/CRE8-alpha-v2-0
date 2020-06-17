import React from 'react';
// import { Link } from 'react-router-dom';

import MyLink from '../../../ui/MyLink';

const Momentum = () => {
    return (
        <>
            <div className="float-right">
                <MyLink to="/rules">Back to Rules</MyLink>
            </div>
            <h1>Momentum</h1>
            <section>
                <p>Any athlete can tell you that sometimes, in a sports event, you're "in the zone," while other times you're "not feeling it." Some friends with real combat experience in the military have assured me that it works the same way. Sometimes, your adrenaline is churning just right and it helps you pull off some stunt that you never could have pulled off normally. CRE8 represents all of this with the momentum subsystem.</p>
                <p>A creature in combat either has momentum or doesn't; you can't have two or three "points of momentum."</p>
                <p>Feel free to flavor your character's momentum in a way appropriate to that character; it can represent mental focus, divine providence, sheer luck, or athletic discipline, just for example.</p>
            </section>
            <section>
                <h2>Gaining Momentum</h2>
                <p>A number of special abilities can grant momentum to a character under special circumstances. This section, however, is about methods that are available to all characters.</p>
                <h3>During Initiative</h3>
                <p>When initiative is rolled, all creatures can additionally attempt to start the battle with momentum by rolling a TN 20 Heroics Check.</p>
                <h3>Surging</h3>
                <p>Once per round on your turn as a free action, <em>if no creature in the encounter has momentum,</em> you may <strong>surge</strong>. Roll 1d20 with no modifiers (TN 16). If this die roll succeeds, you gain momentum.</p>
                <h3>Encouragement</h3>
                <p>If you have momentum, you can use a standard action to <strong>encourage</strong> an ally who can hear you. Attempt a TN 15 Charisma check. On a success, the encouraged ally gains momentum.</p>
            </section>
            <section>
                <h2>Using Momentum</h2>
                <p>A number of special abilities only work while you have momentum. In addition, you may lose or "expend" your momentum to pull off certain actions.</p>
                <p>One such ability is available to all characters, regardless of their special abilities: A creature may expend momentum to cancel a Hazard that would be inflicted on that creature by an attack (unless the specific Hazard says otherwise).</p>
            </section>
            <section>
                <h2>Shaken</h2>
                <p>A creature with the Shaken condition loses momentum and cannot regain it as long as the Shaken condition persists.</p>
            </section>
            <section>
                <h1>Exertion</h1>
                <p>Exertion is a simpler system than momentum, and represents pushing your body beyond its normal limits physically. It is used to power special abilities that state that they require exerting.</p>
                <p>Two requirements must be met in order for a character to exert: they must not already be exerted, and they must have at least one Reserve Point. If these two requirements are met, a character can freely exert.</p>
                <p>To clear an outstanding exertion, a character must take a Short Rest and expend a Reserve Point.</p>
            </section>
        </>
    );
}

export default Momentum;