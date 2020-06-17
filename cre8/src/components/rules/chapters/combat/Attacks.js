import React from 'react';
// import { Link } from 'react-router-dom';

import MyLink from '../../../ui/MyLink';

const Attacks = () => {
    return (
        <>
            <div className="float-right">
                <MyLink to="/rules">Back to Rules</MyLink>
            </div>
            <h1>Attacking and Inflicting Hazards</h1>
            <section>
                <h2>Five-Step Process</h2>
                <p>Normal combat attacks are a little more involved in CRE8 than in most TTRPGs, because of the rich selection of consequences that can result from them.</p>
                <p>Resolving an attack is a five-step process:</p>
                <ol className="inner">
                    <li>Attack Declared; Roll Impact</li>
                    <li>Determine Off-Guard Status of Target</li>
                    <li>Saving Throw Determines Miss, Hit, or Crit</li>
                    <li>Apply Primary Effect of Attack</li>
                    <li>Apply Secondary Effect of Attack</li>
                </ol>
                <p>The results of all five steps are summarized on the following table for easy reference:</p>
                <table>
                    <thead>
                        <tr>
                            <th>Result of Saving Throw:</th>
                            <th>Miss<br />(not off-guard & save succeeded)</th>
                            <th>Hit<br />(off-guard OR save failed)</th>
                            <th>Crit<br />(off-guard AND save failed)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Primary Effect:</td>
                            <td className="center">none</td>
                            <td className="center">VP Damage equal to Impact</td>
                            <td className="center">VP Damage equal to Impact + Hazard</td>
                        </tr>
                        <tr>
                            <td>
                                Secondary Effect<br />(Impact > Target's AV):
                            </td>
                            <td className="center">2 Attrition Damage</td>
                            <td className="center">Hazard</td>
                            <td className="center">Target Dropped</td>
                        </tr>
                    </tbody>
                </table>
            </section>
            <section>
                <h3>1. Attack Declared; Roll Impact</h3>
                <p>The attacker who is spending an appropriate action to make an attack declares their target(s) and the type of attack they are making.</p>
                <p>If the attack is a standard weapon attack, the weapon involved determines the Impact roll for the attack. Otherwise, the ability being used to make the attack should specify the Impact roll. Put the result of the Impact roll aside to use in later steps.</p>
                <p>If the attack has multiple targets, use the same Impact roll result for all of them, to save time, unless the GM requests otherwise.</p>
            </section>
            <section>
                <h3>2. Determine Off-Guard Status of Target</h3>
                <p>The target of an attack is <strong>off-guard</strong> against that attack if any of the following conditions are met:</p>
                <ul>
                    <li>The target is surprised.</li>
                    <li>The target has the Helpless condition (usually as a result of another condition, such as Dropped, Unconscious, or Paralyzed)</li>
                    <li>The attack's Impact exceeds the target's current quantity of Vitality Points (or Hit Points).</li>
                    <li>Some other effect specifically makes the target be Off-Guard against the attack.</li>
                </ul>
            </section>
            <section>
                <h3>3. Saving Throw Determines Miss, Hit, or Crit</h3>
                <p>The target attempts to avoid harm by making a Saving Throw. The type of Saving Throw that opposes the attack can be specified by the ability being used to make the attack; if not, a Defense Save is used by default. (This is the case against standard weapon attacks.)</p>
                <p>The TN of this saving throw is the Accuracy rating of the attack. See below on this page for a few factors that can influence the attack's Accuracy or the Saving Throw's modifiers.</p>
                <p>The Natural Die Result of this saving throw also matters occasionally. If it is less than or equal to the Peril Rating of the attack, then "peril was triggered" for this attack, which can matter later for inflicting Hazards on the target.</p>
                <p>If the Saving Throw vs. the Accuracy succeeds, and the target is not Off-Guard, the attack is a "miss." If the Saving Throw fails or if the target is Off-Guard (but not both), the attack is a "hit." If the Saving Throw fails <em>and</em> the target is Off-Guard, the attack is a "crit."</p>
            </section>
            <section>
                <h3>4. Apply Primary Effect of Attack</h3>
                <p>If the attack was a "hit" or a "crit," the target takes <strong>damage</strong> equal to the attack's Impact.</p>
                <p>If the attack was a "crit," the attacker may also choose a <strong>Hazard</strong> to inflict on the target. Attacks normally have a Hazard Menu that they come with, or use the Standard Hazard Menu (below). Either way, the attacker must choose just one Hazard from the Menu, for which they meet the Requirements.</p>
            </section>
            <section>
                <h3>5. Apply Primary Effect of Attack</h3>
                <p>If the attack's Impact was great enough, the attack has an additional effect. By default, this occurs if the Impact was greater than the target's Armor Value.</p>
                <p>Sometimes the target "resists" the attack (often depending on what <strong>type of damage</strong> the attack is attempting to deal). In this case, Secondary Effects only occur if the Impact exceeds the target's Resistance Value.</p>
                <p>Some standard weapons have the Penetration quality. Attacks with these weapons only need to tie the target's AV (or Resistance Value), not exceed it, in order to cause Secondary Effects.</p>
                <p>Some attacks, particularly spells of a non-physical nature, specify that they compare their Impact with some other number, instead of Armor Value, to determine Secondary Effects. If the target Resists these attacks, still use the Resistance Value instead of the number specified by the attack.</p>
                <p>On a "miss," the Secondary Effect of an attack is 2 <strong>attrition damage</strong>. This represents that, even though the target avoided a mighty attack, doing so required enough effort to wear them out.</p>
                <p>On a "hit," the Secondary Effect of an attack is that the attacker may choose a <strong>Hazard</strong> to inflict on the target. Attacks normally have a Hazard Menu that they come with, or use the Standard Hazard Menu (below). Either way, the attacker must choose just one Hazard from the Menu, for which they meet the Requirements.</p>
                <p>On a "crit," the Secondary Effect of an attack is to inflict the <strong>Dropped</strong> condition on the target.</p>
            </section>
            <section>
                <h2>Hazards</h2>
                <p>Hazards are setbacks that a creature can experience during combat, representing how a combatant seldom goes from "I'm doing great!" to "completely out-of-the-fight" immediately.</p>
                <p>After a Hazard is selected to be inflicted on a target, if that target has momentum, they can expend momentum to cancel the Hazard, unless the Hazard in question states otherwise.</p>
                <p>If the attack you are using does something other than the standard Hazard Menu, pay close attention to whether it <em>adds options</em> to the standard Hazard Menu; or <em>replaces</em> the standard Hazard Menu with a new list of options; or does bad stuff to the target <em>in addition to</em> a normal Hazard effect.</p>
                <p>Qualifying for different Hazard choices is where it matters whether "peril was triggered" for an attack.</p>
                <p>The standard Hazard Menu (used for standard weapon attacks) is as follows:</p>
                <table>
                    <thead>
                        <tr>
                            <th>Requirements</th>
                            <th>Effect</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>The attack is an opportunity attack.</td>
                            <td><strong>Clobber:</strong> Negate the target's current action.</td>
                        </tr>
                        <tr>
                            <td>It is not the target's turn.</td>
                            <td><strong>Clobber:</strong> The target gains the Staggered condition until the end of its next turn.</td>
                        </tr>
                        <tr>
                            <td>The attacker is bigger than the target.</td>
                            <td>The attacker pushes the target away, up to 5 ft for every Size Category of difference between them.</td>
                        </tr>
                        <tr>
                            <td>The attacker is bigger than the target, and the target is staggered.</td>
                            <td>The target is knocked Prone.</td>
                        </tr>
                        <tr>
                            <td>"Peril was triggered" for this attack, or the target is Off-Guard against the attack.</td>
                            <td>The target becomes Wounded.</td>
                        </tr>
                        <tr>
                            <td>The target is Off-Guard against the attack and is Wounded.</td>
                            <td>The target becomes Dying.</td>
                        </tr>
                        <tr>
                            <td>The target is Off-Guard against the attack and is Dying.</td>
                            <td>The target becomes Dropped.</td>
                        </tr>
                    </tbody>
                </table>
            </section>
            <section>
                <h2>Attack Accuracy and Its Modifiers</h2>
                <p>An attack's Accuracy determines how difficult is is to save against.</p>
                <p>Creatures' attacks can have one of three "origins," which determines how their Accuracy is calculated.</p>
                <p><strong>Weapon attacks</strong> are standard physical blows, whether made by natural weapons (e.g. claws, teeth, fists) or other weapons (e.g. swords, arrows). The base Accuracy of a weapon attack is 10 + the attacker's Fighting Level.</p>
                <p><strong>Spell attacks</strong> are standard magical effects. The base Accuracy of a spell attack is 10 + the attacker's Caster Level.</p>
                <p><strong>Vim attacks</strong> are miscellaneous effects that depend on the attacker's physiology, such as a dragon's breath or a basilisk's petrifying gaze. The base Accuracy of a vim attack is 10 + the attacker's Fortitude Save Modifier.</p>
                <p>Many things can modify the number of an attack's Accuracy, such as the attacker's Size Category or if the attacker is wearing armor they are not proficient with, but these modifiers should be included in a character's sheet and you won't have to worry about them while combat is going on. There are four important exceptions, where you may have to adjust attacks' Accuracy (or the Saving Throws against that Accuracy) as a battle progresses, as follows:</p>
            </section>
            <section>
                <h3>Combat Advantage</h3>
                <p>An attack that enjoys <strong>Combat Advantage</strong> has a +2 bonus to its Accuracy. This modifier is only ever applied once to an attack, no matter how many reasons that attack enjoys Combat Advantage; these effects do not "stack."</p>
                <p>Four important reasons that can cause Combat Advantage are (1) if the attacker and their ally are <strong>flanking</strong> the target; (2) if the attacker is <strong>hidden</strong> from the target; (3) if the target is Dazed or Stunned; or (4) the target has used the Hustle option for their Move Action.</p>
            </section>
            <section>
                <h3>Sub-Optimal Use of a Weapon</h3>
                <p>An "improvised" attack is one where a weapon is used sub-optimally for whatever reason. This causes a -5 penalty to the attack's Accuracy. Again, sources of this penalty do not "stack"; the -5 penalty is applied only once.</p>
                <p>This penalty applies if a character is not proficient with the weapon they are using; if they are using it in their off-hand without a special ability that makes them good at such an attack; if they attack while Prone (without a weapon designed for such use); if the object used as a weapon was not intended to be a weapon (e.g. the attacker is hitting the target with a shield or a tavern stool); or an actual weapon is being used in a non-standard manner, such as a pommel strike with a sword in order to deal nonlethal/bludgeoning damage instead of the sword's normal damage.</p>
                <p>Sometimes this penalty will already be included on a character's stats on their sheet, e.g. for a Shield Bash attack. When this is the case, remember not to apply the penalty <em>again</em> for another reason.</p>
            </section>
            <section>
                <h3>Long-Range Attacks</h3>
                <p>Ranged attacks usually have three ranges given: their Short, Medium, and Long Range limits. These attacks become less accurate the further the attacker stands from the target.</p>
                <p>A ranged attack from beyond Short Range has a -2 penalty to its Accuracy.</p>
                <p>A ranged attack from beyond Medium Range has a -5 penalty to its Accuracy.</p>
                <p>A ranged attack from beyond Long Range has a -10 penalty to its Accuracy, as long as the GM rules it has any chance of hitting at all.</p>
            </section>
            <section>
                <h3>Wounded</h3>
                <p>A Wounded creature has a -2 penalty to all of its Saving Throws. This is technically a modifier to those Saving Throws, not to attack Accuracy, but it is listed here anyway because it must be remembered at the same moments as Accuracy modifiers.</p>
            </section>
            <section>
                <h2>Attack Peril Rating and Its Modifiers</h2>
                <p>An attack's Peril Rating determines whether a low Natural Die Result on a Saving Throw "triggers peril," which influences which Hazards may be inflicted by an attack.</p>
                <p><strong>Weapon attacks'</strong> base Peril Rating is the attacker's Fighting Level. <strong>Spell attacks'</strong> base Peril Rating is the attacker's Caster Level. <strong>Vim attacks'</strong> base Peril Rating is the attacker's Fortitude Save Modifier.</p>
                <p>Standard weapons and abilities that grant attacks will specify a Peril Mod, which modifies the base number. For standard weapons in particular, this represents how likely the weapon is to make the target start bleeding profusely&mdash;a major advantage of slashing weapons in particular.</p>
                <p>Peril Rating of an attack should be included in a character's stats in most cases, so you don't have to worry about calculating it when the attack occurs.</p>
            </section>
            <section>
                <h2>Attack Impact and Its Modifiers</h2>
                <p>An attack's Impact determines how hard it hits (or threatens to hit). An effectual attack (as determined by the GM) always has an Impact of at least 1, even if the die roll's penalties would normally reduce it to less than 1.</p>
                <p>Standard weapons and abilities that grant attacks will specify a their Base Impact. For weapons, for example, this is generally 1d4, 1d6, 1d8, 1d10, or 1d12. There are a few common situations that modify this base Impact number, as follows:</p>
            </section>
            <section>
                <h3>Attacker Size</h3>
                <p>Bigger creatures tend to have higher attack Impact, at least with <strong>weapon attacks</strong>.</p>
                <p>A creature's size category can be permanent or temporary. In the former case, Impact modifiers should be included in the stats on a character sheet, and do not need to be tracked during combat time.</p>
                <p>Temporary size category changes are rarer. A temporary increase in size category gives a creature's weapon attacks +1d4 Impact, while a temporary decrease in size category penalizes weapon attack Impact by -1d4.</p>
            </section>
            <section>
                <h3>Two-Handing</h3>
                <p>A Versatile-Heft weapon, or a Two-Handed-Heft weapon, gains a +1 bonus to Impact when wielded in two hands (unless the weapon description says otherwise, as Crossbows do).</p>
                <p>This bonus should be included in a character sheet's stats, so it does not need to be tracked during combat time in most cases.</p>
            </section>
            <section>
                <h3>Brawn Synergy</h3>
                <p>With no special abilities needed, characters enjoy Brawn-based Synergy Bonuses to their AV and their weapon attacks' Impact. This gives them a +1 or +2 bonus to Impact if they have enough Ranks of Brawn, as dictated in the Synergy Bonus rules (and depending on whether this bonus to Impact is a Primary Synergy or a Secondary Synergy).</p>
                <p>Crossbows are, again, an important exception, and do not enjoy this bonus.</p>
                <p>This bonus should be included in a character sheet's stats, so it does not need to be tracked during combat time in most cases.</p>
            </section>
            <section>
                <h3>Prone Targets</h3>
                <p>A non-Prone attacker attacking a Prone target with a melee weapon attack gains a +1d4 bonus to Impact.</p>
                <p>Mounted creatures may treat targets of their attacks as Prone for this purpose, if their target is a smaller size category than their mount.</p>
            </section>
        </>
    );
}

export default Attacks;