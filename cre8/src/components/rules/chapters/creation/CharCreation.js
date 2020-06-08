import React from 'react';
import { Link } from 'react-router-dom';

import MyLink from '../../../ui/MyLink';

const CharCreation = () => {
    return (
        <>
            <div className="float-right">
                <MyLink to="/rules">Back to Rules</MyLink>
            </div>
            <h1>Creating a Character</h1>
            <p>The Configure tab of the character sheet guides you through this process, but in case it's not clear enough (or you're actually playing CRE8 without using the automated character sheet), here are additional instructions.</p>
            <section>
                <h2>1. Basics</h2>
                <p>Ask your GM how much Base XP your character should start with (which will determine your character's starting Level, unless you get boosted to a higher Level by XP Parcels).</p>
                <p>Choose two Languages for your character. It is recommended that you choose Common, and that you choose the language that goes with your race if you are not going to be human.</p>
                <p>You can also choose your character's name and epithet at this point, or you can wait until you've made other choices about the character.</p>
            </section>
            <section>
                <h2>2. Strongest Saving Throw</h2>
                <p>Your character gets a free boost in one saving throw: Fortitude, Reflex, or Willpower. This is a +2 bonus, and counts as part of the "base" saving throw, which helps you qualify for special abilities related to that statistic.</p>
                <p>If you're not sure which saving throw to pick here, go with Willpower if you intend to be a spellcaster. Go with Fortitude if you intend to be a warrior who gets hit a lot, and go with Reflex if neither of the other two statements apply.</p>
            </section>
            <section>
                <h2>3. Allocate Skill Ranks</h2>
                <p>Choose two of your character's Skills to be "trained." Each trained Skill gains two free Ranks.</p>
                <p>Add five Skill Ranks per character level (up to level 8). Untrained Skills can't have more ranks than your level; trained Skills can have two more Ranks.</p>
            </section>
            <section>
                <h2>4. Level 1 Special Abilities</h2>
                <p>If you intend to be non-human, choose a first Kit that represents your racial choice, such as the Orc kit for an orcish character. Human characters can choose the Human Paragon kit for this slot, or start with two Kits of their choice instead of just one.</p>
                <p>Choose your other Level 1 special abilities in any order. You start with two Kits (including your racial choice), one Feat, and four Talents (or five, if one of them is a [Flaw] talent).</p>
            </section>
            <section>
                <h2>5. Higher-Level Special Abilities</h2>
                <p>At higher levels, Kits must be selected before Feats, and Feats before Talents, which may affect whether you qualify for abilities' Prerequisites.</p>
                <p>You gain a new Kit at Levels 3, 5, 7, and 9. You gain a new Feat at each Level, up to Level 8. You gain a new Talent at each Level.</p>
            </section>
            <section>
                <h2>6. Equip Your Character</h2>
                <p>Ask your GM how much Wealth you should start with, especially if you are starting at a higher Level. If starting Wealth is different than the standard 20, adjust your initial Wealth on the Configure tab.</p>
                <p>Then, spend your Wealth to buy items. Note that your money will stretch further if you buy cheap items first, but the expensive items are often the ones that will be most crucial to your character to have.</p>
                <p>If you roll poorly on your purchases and don't end up with equipment you really need to adventure, the GM may allow you to gain neccessary items for free, especially if the initial Wealth was the standard 20 or less.</p>
                <p>Once you have your equipment, choose where you hold (or don't hold) each item. Items can be worn or wielded, held in a place where they are readily available to grab, placed in other items that are Containers, or not carried (as is common with vehicles, for example).</p>
            </section>
            <section>
                <h2>7. Specific Choices</h2>
                <p>If you have at least 3 Ranks of Brawn or your special abilities give you Synergy Bonuses, choose a Primary Synergy Bonus for each Skill that provides Synergy Bonuses.</p>
                <p>If any other options have popped up under your other special abilities, and you haven't made choices for them yet, do so at this point.</p>
            </section>
            <section>
                <h2>8. Update Statistics</h2>
                <p>The automated character sheet should take care of this step for you, but if you aren't playing with the automated character sheet or you want to check it for bugs, you can use these guidelines to calculate statistics.</p>
                <p>Your Heroic Bonus (used for your Heroics Check) is equal to your Level divided by 2, rounded down, to a maximum of +4. This number is also added to all of your saving throws, your Fighting Level, your Caster Level, and your Coast Number.</p>
                <p>Your Awesome Check, before any special modifiers, is equal to your Level plus 4, to a maximum of +12.</p>
                <p>Your Vitality Points Pool, before added to by Kits, is equal to your Level times 2 (to a maximum of 16), plus your base Fortitude bonus, plus 5.</p>
                <p>Your Reserve Points Pool, before any special modifiers, is 4.</p>
                <p>Your Magic Points Pool and your Spellcraft Check, before any special modifiers, are both equal to your Caster Level.</p>
                <p>Your base Coast Number, before adding your Heroic Bonus or any adjustments from Kits, is 6.</p>
                <p>Each Rank you have in a Skill gives that Skill a +1 bonus. Remember that Trained Skills, in addition to having their maximum Ranks increased by 2, gain 2 Ranks for free.</p>
                <p>Primary Synergy Bonuses are +1 if you have at least 3 Ranks in the relevant Skill, or +2 if you have at least 7 Ranks.</p>
                <p>Non-Primary Synergy Bonuses are +1 if you have at least 5 Ranks in the relevant Skill, or +2 if you have at least 9 Ranks.</p>
                <p>Your Armor Value, before any special modifiers, is 2.</p>
                <p>Your Resistance Value, before any special modifiers, is either your Armor Value plus 4, or your Level (max 8) plus 4, whichever is greater.</p>
                <p>Your Speed Check modifier, before any special modifiers, is +15.</p>
                <p>Your Total Bulk Capacity is 50 + 10 * your Brawn check modifier. For each 10 Bulk you carry in excess of this number (rounded up), you incur a -1 penalty to Athletics, Dexterity, and Stealth. This is in addition to similar Encumbrance penalties from your armor or shield.</p>
                <p>If you are not using the automated character sheet, don't forget to fill in the statistics of your Attacks, too. Most of an Attack's statistics are given by the weapon or special ability that grants the Attack.</p>
                <p>Attack Accuracy, before any special modifiers, is 10 plus your Fighting Level (or your Caster Level for a spell attack, or your Fortitude Bonus for a vim attack).</p>
                <p>Attack Peril Rating, before the weapon's Peril Mod or any other special modifiers, is your Fighting Level (or your Caster Level for a spell attack, or your Fortitude Bonus for a vim attack).</p>
                <p>Don't forget to add +1 to your weapon's Impact if it is being wielded in two hands (and is a weapon built for such an arrangement, and not a Crossbow). Impact is also modified by your Size, and by a built-in Brawn-based Synergy Bonus.</p>
            </section>
            <section>
                <h2>9. Don't Forget to Save</h2>
                <p>Your hard work should have been saved periodically to the site, but when you are done, make sure to save your last few steps by hitting the Save Character button beneath the character sheet. (Hitting CTRL+S should also work.)</p>
            </section>
            <section>
                <h2>Overwhelmed by Choices?</h2>
                <p>If there are just too many options to choose from, especially in your Special Abilities selection, you may want to copy most of the choices made by a <Link to="/rules/prebuilt">Pre-Built Character</Link>. This is recommended for beginners.</p>
            </section>
        </>
    );
}

export default CharCreation;