import React from 'react';
import MyLink from '../../../ui/MyLink';

const DiceMechanics = () => {
    return (
        <>
            <div className="float-right">
                <MyLink to="/rules">Back to Rules</MyLink>
            </div>
            <h1>Dice Mechanics: General</h1>
            <section>
                <h2>Dice Varieties</h2>
                <p>
                    A standard set of polyhedral dice for a Tabletop Role-Playing Game includes the following varieties:
                    <ul>
                        <li>Four-sided tetrahedral dice, known as <strong>d4</strong>s.</li>
                        <li>Six-sided cubic dice, known as <strong>d6</strong>s.</li>
                        <li>Eight-sided octahedral dice, known as <strong>d8</strong>s.</li>
                        <li>Ten-sided dice, known as <strong>d10</strong>s. Often one side of a d10 will be marked with a "0." Pretend that this side has a value of 10. See <strong>d% or d100</strong> below for more about d10s.</li>
                        <li>Twelve-sided dodecahedral dice, known as <strong>d12</strong>s.</li>
                        <li>Twenty-sided icosahedral dice, known as <strong>d20</strong>s. In CRE8, this is the most important and most-often used die.</li>
                    </ul>
                </p>
            </section>
            <section>
                <h2>NdS Notation</h2>
                <p>TTRPG rules will often instruct you to roll two numbers with a "d" in between them, such as "roll <strong>3d8</strong>." This means that you roll a number of dice equal to the first number, each with a number of sides equal to the second number. For example, 3d8 would mean to roll three 8-sided dice. Read further in the rules to determine what to do with the results of the dice roll. Sometimes you will add the dice results together to get a final number; other times you will ignore some dice and pay attention to others.</p>
            </section>
            <section>
                <h2>d% or d100</h2>
                <p>Sometimes (not very often in CRE8), TTRPGs will instruct you to roll <strong>d%</strong> or <strong>d100</strong>. If you do not have an actual hundred-sided die (a specialty item), you can roll two d10s and use one result as the ten's-place digit, the other result as the one's-place digit. Most dice sets come with two d10s, one of them marked with "00," "10," "20," etc., to facilitate this. When rolling 2d10 in this manner, do not treat a "0" as a result of 10. If you roll a "0" on one d10 and a "00" on the other d10, the final result is treated as 100.</p>
            </section>
            <section>
                <h2>Electronic vs. Physical Dice</h2>
                <p>There are plenty of online utilities, including this site, for rolling "dice" electronically by generating random numbers. Although there is some charm to using physical dice, for CRE8, using electronic dice is recommended. It speeds up gameplay, especially when the rules call for ignoring some of the dice and paying attention to others.</p>
            </section>
            <h1>Dice Mechanics: Specific to CRE8</h1>
            <section>
                <h2>The Weighted d20 System</h2>
                <p>Most often in CRE8, you will roll 3d20, take the middle result, add a number to it, and compare the sum to a "Target Number" or <strong>TN</strong> to detemine success or failure.</p>
                <p>Rolling three times and taking the middle result makes results from 5-16 more common, and high (17-20) or low (1-4) results rarer, compared to just rolling a single d20. This is intended to make small bonuses and penalties to dice rolls matter more.</p>
                <p>Numbers you add to a die result are called "bonuses" (for positive numbers), "penalties" (for negative numbers), or just "modifiers" (all of the above, or even zero). Modifiers are also defined by types, such as "encumbrance penalties" and "feat bonuses."</p>
                <p>Often more than one modifier will apply to a die roll. In this case, add all the modifiers together to get a final modifier, with the exception of bonuses that "overlap" instead of "stack."</p>
                <p>If bonuses are not "circumstance bonuses," "size bonuses," or "untyped" (miscellaneous) bonuses, they "overlap." This means that only the biggest bonus applies to a die roll. For example, if my character has a +2 feat bonus and a +3 feat bonus to his Defense save die roll, only the +3 bonus applies. Penalties never "overlap," nor do the three types of bonuses listed above as long as they come from separate effects.</p>
                <p>Once you have your Natural Die Result, your total modifier from bonuses and penalties, and you add them together, you compare the final result to a Target Number (<strong>TN</strong>). If the die result is greater than or equal to the TN, the die roll succeeds. If the die result is less than the TN, the die roll fails.</p>
            </section>
            <section>
                <h2>Natural Die Results</h2>
                <p>The number you get from rolling dice, before you add or subtract any modifiers, is called the "Natural" die result, and sometimes it matters. In CRE8, this usually applies when you roll defensive dice against an attack. If the Natural Die Result is lower than the attack's "Peril Rating," then "peril is triggered," which can change the consequences of the attack.</p>
            </section>
            <section>
                <h2>Boosted Die Rolls</h2>
                <p>Sometimes your character will act with favorable circumstances aiding her, but it would be inconvenient to keep track of yet another die modifier. In these cases, the game rules allow you to roll a "boosted" roll. Instead of rolling 3d20 and taking the middle result, roll 2d20 and take the higher result.</p>
                <p>Boosts do not "stack." If your roll is boosted by more than one favorable circumstance, you still roll only 2d20.</p>
            </section>
            <section>
                <h2>Dragged Die Rolls</h2>
                <p>It is a little bit rarer, but sometimes the rules call for the opposite of boosting your die roll. For a "dragged" die roll, roll 2d20 and take the lower result.</p>
                <p>Drags do not "stack." If your roll is dragged by more than one unfavorable circumstance, you still roll only 2d20.</p>
            </section>
            <section>
                <h2>Boosted And Dragged Die Rolls</h2>
                <p>If your die roll is boosted by any number of favorable effects, and dragged by any number of unfavorable effects, you just roll a single d20 and use its result. This introduces slightly more randomness to the game than normal, which represents how "anything can happen" in these circumstances.</p>
            </section>
            <section>
                <h2>Coasting</h2>
                <p>Your character has a statistic called his Coast Number. Sometimes the rules allow him to "coast" a d20 roll. In this case, roll the d20s normally (3d20 and take the middle result unless the roll is boosted or dragged), but if the Natural Die Result is lower than his Coast Number, use his Coast Number instead of the Natural Die Result to determine the outcoome. Add any modifiers to the Coast Number normally, and compare the final number to the TN normally.</p>
                <p>Coasting is intended mainly to prevent heroes from making embarrassing mistakes at easy tasks. By default, he is allowed to "coast" most rolls that involve a Skill, as long as he is not under a lot of pressure. When he is performing a routine task or can act slowly and carefully, he can avoid the worst results of his actions.</p>
                <p>Many special abilities allow characters to "coast" Skill checks that they could not normally "coast," even if they are under a lot of pressure. This makes them more heroic.</p>
            </section>
            <section>
                <h2>Capped Die Rolls</h2>
                <p>Your character also has a statistic called his Heroic Bonus. It represents basic competency at everything, but is not a very high statistic.</p>
                <p>For many tasks that benefit a lot from specialized training, such as picking a lock, die rolls are "capped" unless a character has that specialized training. This means that the character can still attempt to do something, but if their Skill involved in the task is better than their Heroic Bonus, they have to use their Heroic Bonus instead of the relevant Skill.</p>
                <p>For example, Gunnzo the Goblin is a high-level character who is generally good at using items (tying knots, assembling clockwork, mixing up chemicals in a beaker), but hasn't gotten around to learning how locks work specifically. His Gadgetry Skill is +9, but his Heroic Bonus is only +3. If he attempts to pick a lock, he has to use the +3 modifier to his die roll instead of the +9.</p>
                <p>"Capped" die rolls are never a positive thing; you don't get to use your Heroic Bonus instead of a skill check if the Heroic Bonus is better.</p>
            </section>
            <section>
                <h2>Roll Replacement</h2>
                <p>Many special abilities let you use one statistic "in place of" another when rolling dice. This means you use the less standard statistic's modifiers in place of the standard statistics modifiers when determining your die roll result.</p>
                <p>Your character has a statistic called her Awesome Check. It is a high statistic and is primarily intended to be used with Roll Replacement, letting her get great die roll results when she has very favorable circumstances.</p>
                <p>For example, all characters have the option to use the "total defense" special ability in combat. After using this ability, a character can use her Awesome Check in place of her Defense Save until the start of her next turn. If she has an Awesome Check of +7 and a Defense Save of +4, when she is attacked she can roll 3d20, take the middle die result, and add 7 to it to determine how effective her Defense is. Her normal Defense modifier of +4 is irrelevant in this situation.</p>
                <p>Roll Replacement can be "transitive." For example, if a character has one special ability to use Willpower in place of Defense, and another special ability to use Perception in place of Willpower, then the player can use Perception in place of Defense if both special abilities would normally apply to the situation.</p>
            </section>
        </>
    );
}

export default DiceMechanics;