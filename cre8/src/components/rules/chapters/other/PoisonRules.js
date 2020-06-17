import React from 'react';
import MyLink from '../../../ui/MyLink';

const PoisonRules = () => {
    return (
        <>
            <div className="float-right">
                <MyLink to="/rules">Back to Rules</MyLink>
            </div>
            <h1>Poison</h1>
            <p>Poison comes in two major varieties: fast poisons, which are useful for disabling foes in the heat of combat, and slow poisons, which are less useful in combat but often deadlier.</p>
            <section>
                <h2>Fast Poisons</h2>
                <p>When a creature is first exposed to fast poison, she takes poison damage, and must make a saving throw (normally Fortitude) to determine the poison's initial stage. On a successful save, the poison starts at Stage A. On a failure, the poison starts at Stage B.</p>
                <p>At the end of her turn, the poisoned creature makes an additional saving throw. On a success, the poison's stage lessens by one degree. On a failure, she takes poison damage again. On a Natural 1, the poison's stage worsens by one degree.</p>
                <p>A poisoned character with VP remaining may spend a standard action "shrugging off" the poison; this causes her saving throw at the end of that turn to be boosted.</p>
                <p>Repeated exposure to the same fast poison while it is already in her system means the poisoned creature takes the initial damage again, and must immediately make another saving throw to prevent the poison from worsening by one stage.</p>
                <section>
                    <h3>"Standard" Fast Poison Progression</h3>
                    <table>
                        <tbody>
                            <tr>
                                <th>Fortitude TN</th>
                                <td>Varies according to the source of the poison.</td>
                            </tr>
                            <tr>
                                <th>Initial Poison Damage</th>
                                <td>The amount of poison damage varies according to the source of the poison, but it is incidental poison damage (so creatures resistant to poison damage ignore it).</td>
                            </tr>
                            <tr>
                                <th>Repeated Poison Damage</th>
                                <td>1 incidental poison damage.</td>
                            </tr>
                            <tr>
                                <th>Stage A</th>
                                <td>The creature is battered. Effects that would otherwise remove the battered condition cure the poison.</td>
                            </tr>
                            <tr>
                                <th>Stage B</th>
                                <td>The creature is battered and dazed. Effects that would otherwise remove the battered condition lessen the poison's effect by one stage.</td>
                            </tr>
                            <tr>
                                <th>Stage C</th>
                                <td>The creature is battered and stunned, but her saves against the poison at the end of her turn are automatically boosted. Effects that would otherwise remove the battered condition lessen the poison's effect by one stage.</td>
                            </tr>
                            <tr>
                                <th>Stage D</th>
                                <td>The creature is battered and dying, and can no longer save against the poison at the end of her turn unless she is stable. Effects that would otherwise remove the battered condition lessen the poison's effect by one stage.</td>
                            </tr>
                            <tr>
                                <th>Stage E</th>
                                <td>The creature is dead.</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </section>
            <section>
                <h2>Slow Poisons</h2>
                <p>Slow poisons use the same rules for progression as diseases.</p>
            </section>
        </>
    );
}

export default PoisonRules;