import React from 'react';
import { Link } from 'react-router-dom';

import MyLink from '../../../ui/MyLink';

const RPGBasics = () => {
    return (
        <>
            <div className="float-right">
                <MyLink to="/rules">Back to Rules</MyLink>
            </div>
            <h1>Introduction to CRE8</h1>
            <p>You're probably wondering "with so many TTRPGs available, why should I learn to play CRE8?" It's a fair question. CRE8 tries to cover the same ground as a lot of other popular RPGs: fantasy setting, with a mix of swords-and-sorcery and high-fantasy elements; not particularly "narrative." It just tries to do these things better. At least it's free. Beyond that, I'll try to highlight a few of the ways I think it succeeds.</p>
            <section>
                <h2>Roots</h2>
                <p>CRE8 draws inspiration from <em>many</em> other RPGs and is truly a unique beast, but it's most fundamentally rooted in Edition 3.5 of <em>Dungeons & Dragons</em>, the system I was most familiar with when I started making CRE8. It tries to preserve some of the things that were elegant about this game, such as monsters being created by a similar process to PCs. That said, Edition 3.5 had plenty of weaknesses that needed fixing, too ...</p>
            </section>
            <section>
                <h2>Minimizing Fiddly Dice Modifiers</h2>
                <p>When you roll the dice, you should be able to add a total modifier that is written on your character sheet, and should not have to keep track of many other modifiers that must be added and subtracted. There are a couple fundamental important cases where you do apply a modifier that's not on your character sheet (e.g. making an "improvised" attack or when your character is Wounded), but these are far fewer than in many other games, and should become habitual. CRE8 uses other methods to influence dice results, as detailed under <Link to="/rules/dice">Dice Mechanics</Link>.</p>
            </section>
            <section>
                <h2>Epic Eight</h2>
                <p>"CRE8" stands for "Codex of Roleplaying: Epic Eight." The "Epic Eight" refers to how CRE8 stems from a variation of Edition 3.5 called "E8" (based on a more well-known variation called "E6"), in which characters' statistics mostly only increase until they get to Level 8, after which they are "epic" characters with a different progression system. The net effect of Epic Eight is similar to that of "bounded accuracy" in Edition 5 of <em>Dungeons & Dragons</em>; as characters grow, they mostly become more versatile rather than just having bigger numbers on their sheet (although bigger numbers are important too, especially up to Level 8).</p>
                <p>Epic Eight means that numbers are very important in battle. Low-level characters can take on pretty scary monsters if they can gang up on them, while high-level characters can still be threatened by armies of weak characters.</p>
            </section>
            <section>
                <h2>Modular PC Archetypes</h2>
                <p>Instead of character "classes," CRE8 lets you pick your special abilities from a menu as you gain levels, essentially building your own "class." This lets you build a "Ranger" who fights better with a sword and shield than with two weapons, and can have some magical abilities or none at all, as befits your ideal of a Ranger. Or a "Bard" who can be either a frivolous jester or a wise man from Welch mythology.</p>
            </section>
            <section>
                <h2>Reigning In the Power of Magic</h2>
                <p>Some RPGs are infamous for having spellcasters be far more powerful than non-spellcasters. CRE8 puts many limitations on magic, including sharply limiting how much magic power spellcasters have in any individual conflict, especially at low levels, to give other characters a fair chance. In addition, all characters have a selection of special moves they can do in combat even if they don't cast "spells," so they should never be stuck just repeating "I hit the monster with my sword" in combat.</p>
            </section>
            <section>
                <h2>No "Fifteen-Minute Workday"</h2>
                <p>In some RPGs, characters can run out of resources very quickly if they're played as powerfully as possible&emdash;resources that they only get back by resting for the night. Unless they're under particular time pressure in the story, it's efficient for them to use these resources as fast as possible, then wait until the next day to continue their adventures. In CRE8, the only resource you get back by sleeping for the night is "Reserve Points," and there are limits to how fast you can use your Reserve Points up, so adventures are encouraged to continue a little longer each day of the story.</p>
            </section>
            <section>
                <h2>Avoiding the "Christmas Tree Effect"</h2>
                <p>In some RPGs, minor magic items are so common, and so neccessary for a character's power, that at high levels characters end up looking "like a Christmas Tree" with sparkly or glowing ornaments all over their body.</p>
                <p>CRE8 strives to make permanent magic items feel special, by limiting how much they can truly add to a character's overall power, limiting how many of them a character can use, and making them grow in power along with their wielder, so that minor items at low levels can become major items later on. Characters' lack of reliance on magic items means the GM can be in charge of how often to introduce them, as befits the story.</p>
            </section>
            <section>
                <h2>Vitality Points instead of Hit Points; Armor Value and Defense instead of Armor Class</h2>
                <p>CRE8 departs from some common conventions of other RPGs when it comes to measuring a character's defenses in combat. A mid-level Barbarian character can't keep fighting at full potential with four arrows sticking out of her chest, because serious weapon hits like that do more than just subtract from a pool of "hit points." Instead, a character's "Vitality Points" represent mostly their stamina to be able to keep fighting energetically, while serious wounds are kept track of through the Wounded and Dying conditions.</p>
                <p>Wearing a lot of armor doesn't make you harder to hit, but minimizes the consequences when you do get hit.</p>
                <p>As a side note, I've always found it more exciting to roll the dice to determine my character's life or death, rather than rolling the dice to determine whether my foe is hit by my attack. Therefore, in CRE8, the defender always rolls a Saving Throw against an attack, rather than the attacker making an "attack roll." This is in contrast to a common RPG approach where the defender usually rolls against spells, but the attacker usually rolls for ordinary weapon attacks.</p>
            </section>
            <section>
                <h2>Dynamic Attack Consequences</h2>
                <p>The attack rules in CRE8 are one of its most complicated parts, admittedly. But because of that, ordinary attacks can have more consequences than just "nothing," "subtract hit points from the target," and "knock the target out."</p>
                <p>In CRE8, when a troll hits Gimli hard with its club, Gimli can be sent tumbling across the room without the troll needing a special ability to do so.</p>
            </section>
            <section>
                <h2>Eliminating the Copper Piece Headache</h2>
                <p>In CRE8, characters have a Wealth statistic, instead of keeping track of exactly how many coins of several varieties they have collected. The Wealth score also grows logarithmically, meaning the numbers you need to keep track of aren't <em>too</em> huge even if your character is very, very rich.</p>
                <p>As your character's Wealth grows, this mechanic allows you to do less and less bookkeeping about things like your character buying a drink from a tavern or finding a small pile of copper pieces. This also disincentivizes more wealthy characters from looting every crappy weapon or piece of equipment they can find in a dungeon, to cart back to town and sell for small change.</p>
                <p>I've never enjoyed keeping track of small coins and pragmatically "needing" to loot everything I see. If you feel the same way, this Wealth system is for you.</p>
            </section>
        </>
    );
}

export default RPGBasics;