import React from 'react';
import { Link } from 'react-router-dom';

import MyLink from '../../../ui/MyLink';

const CharSheetTour = () => {
    return (
        <>
            <div className="float-right">
                <MyLink to="/rules">Back to Rules</MyLink>
            </div>
            <h1>A Tour of a Character Sheet</h1>
            <p>Take a moment and open <Link to="/bestiary/humantownguard">this Character Sheet</Link> in a new tab of your browser. It might look complicated at first, but we'll try to break down all the statistics on it and make them intuitive.</p>
            <section>
                <h2>Four Tabs</h2>
                <p>In the top right of the character sheet, you can see four tabs that are available: "Play," "Configure," "Bio," and "+Library."</p>
                <p>The "Play" tab is what you will need to have open most of the time if you are using this website to actively play a game of CRE8. It lets you roll relevant dice easily and keep track of your statistics that change often, such as Vitality Points and Magic Points.</p>
                <p>The "Configure" tab is mostly used when you are building your character, or gaining a level.</p>
                <p>The "Bio" tab is a place for keeping track of your character's traits that are more related to the story of the campaign, and less related to the rules. Things that help you roleplay, rather than things related to dice rolls.</p>
                <p>Most of you can ignore the "+Library" tab. It is used by the website's administrators to add more character options to the website's database.</p>
            </section>
            <section>
                <h2>The Play Tab</h2>
                <section>
                    <h3>Character Sheet Head</h3>
                    <p>At the top of this tab, there is basic information: the creature's name, level, and a short description of what it is. (For PCs, they can put what "class" they consider themselves to be in this short description field.)</p>
                    <p>To the right is a summary of how much XP the creature is worth when defeated, or (for PCs) how much XP they have accrued towards going up in level.</p>
                </section>
                <section>
                    <h3>Pools</h3>
                    <p>Next on the left side of the character sheet are the character's "Pools," or points they have that may change frequently.</p>
                    <h4>Vitality Points (VP)</h4>
                    <p>A character's short-term stamina, luck, and ability to defend themself and keep fighting is represented by a Pool of "Vitality Points." When this number gets low, you are in danger of being hurt badly by attaacks.</p>
                    <h4>Reserve Points (RP)</h4>
                    <p>A character's long-term endurance is represented by a Pool of "Reserve Points." They can use these up to "recharge" their Vitality Points, Magic Points, and some other abilities when they take a short rest (5 minutes). When this number gets low, you are in danger of becoming exhausted and needing badly to take a night's rest.</p>
                    <h4>Magic Points (MP)</h4>
                    <p>A character's mystic reserves are represented by a Pool of "Magic Points." Spellcasters use these up to cast spells or rituals. Even nonmagical characters can "use" their Magic Points to attune to magical items.</p>
                </section>
                <section>
                    <h3>General Stats</h3>
                    <p>Next on the left side of the character sheet are the character's "general stats," defining their defenses and some other abilities that just don't fit anywhere else.</p>
                    <h4>Armor Value</h4>
                    <p>This is a number that defines how well a character can withstand ordinary blows. Attacks that beat this number have more severe consequences.</p>
                    <h4>Heroics Check</h4>
                    <p>This is a number that represents your character's basic overall competence. You usually use it by adding it to a d20 roll for something you are not very good at, including "capped" skill checks. It grows as you go up in level, but not a whole lot.</p>
                    <h4>Awesome Check</h4>
                    <p>This is a number that represents how good your character can be at her best. It is typically higher than most other statistics, and usually used by adding it to a d20 roll in place of another statistic in a specific situation that your character is very good at.</p>
                    <h4>Spellcraft Check</h4>
                    <p>This represents your character's overall skill and finesse at shaping the magic that he knows how to use. You usually use it by adding it to a d20 roll for something magical.</p>
                    <h4>Speed Check</h4>
                    <p>This represents how fast your character can move around a battlefield. When you move, you add a number to this number (usually +15) to determine how far you can go, and you also roll a d20 and add this number to determine if you can add a minor special effect (called a "maneuver") to your movement. This might seem like a huge number compared to your other statistics, but that's because it gets compared to a number of feet of distance, and one foot isn't very far in battle.</p>
                    <h4>Resistance Value</h4>
                    <p>This is like Armor Value, but for attacks that a character is particularly resistant to, like a fiery dragon against a fire attack or a werewolf against an ordinary (non-silver) sword.</p>
                    <h4>Defense Save</h4>
                    <p>"Saves" or "Saving Throws" are the main dice rolls you make to defend your character against attacks and other dangers. The numbers on this part of your character sheet get added to a d20 roll to determine how effective those defenses are. Defense is used to counter most physical blows&emdash;basically things that a shield would help you block. (And, indeed, shields are the main way to improve this statistic, other than going up in level.)</p>
                    <h4>Fortitude Save</h4>
                    <p>Fortitude represents your character's overall physical health. A good Fortitude score gets you more Vitality Points, helps you resist poisons and similar effects, and helps you heal after you do get injured.</p>
                    <h4>Reflex Save</h4>
                    <p>Reflex represents your character's overall quickness and ability to react. Even though this is called a "Save," you don't use it <em>that</em> often to defend against danger. It can be used that way in some cases, like avoiding falling into a pit trap or looking away from a Medusa before you can get turned to stone. But more often, Reflex is used to determine what order creatures act in combat.</p>
                    <h4>Willpower Save</h4>
                    <p>Willpower represents your character's overall mental stamina. It is used to counter fear, mind control, mystic curses, and other mental attacks. It also helps spellcasters recover their Magic Points without getting exhausted as quickly.</p>
                </section>
                <section>
                    <h3>d20 Die Modes and Conditions</h3>
                    <p>On the right of this part of the character sheet are tools to help keep track of your character's current condition in ways that don't involve statistics, as well as tools to help you roll dice efficiently.</p>
                    <p>First, there is a small dropdown menu in which you can specify that your next d20 roll should be boosted, dragged, both, or (normally) neither. This saves you the effort of sorting the results when you roll 2d20 or 3d20.</p>
                    <p>Next, there is a checkbox you can check when your character is able to Coast a skill check. This box will make the die roller automatically use your Coast Number if it is better than the Natural Die Result.</p>
                    <p>Momentum and Exerting have their own rules, and are not truly Conditions. See their individual sections. For the rest of the checkboxes in this area, you can check out the <Link to="/rules/conditions">Conditions page</Link> to see what they mean.</p>
                </section>
                <section>
                    <h3>Skills</h3>
                    <p>Skills are ten important areas that your character can be good or bad at, aside from general competence or attacking or defending.</p>
                    <p>Athletics is about how much control your character has of their body's physical movements. It is used for acrobatic stunts, climbing, jumping, and swimming.</p>
                    <p>Brawn is about raw strength. It is used for how much you can lift or carry, or whether you can just pull an object apart or push away someone trying to grab you. It also has an indirect effect on your physical attacking and defending capabilities, without needing to take any special abilities to do so.</p>
                    <p>Charisma is about the strength and depth of your personality, your raw "presence" and ability to get people to pay attention to you and care about you over time (whether positively or negatively). It is used to determine how good a leader a character is.</p>
                    <p>Dexterity is about fine motor control and manual coordination. It is used for delicate tasks, usually involving one's hands.</p>
                    <p>Gadgetry is about how clever and capable your character is at using objects. It is used for operating vehicles, crafting objects from raw materials, and figuring out how physical traps work.</p>
                    <p>Glibness is about how well your character can talk, in the short term. It is used for convincing people you just met of something you say, or lying convincingly.</p>
                    <p>Knowledge is about how generally intelligent your character is. It is used to see if your character can recall information on a particular subject, or sometimes to determine how complex of thoughts they can concentrate on.</p>
                    <p>Nature is about how in tune your character is with the natural world. It is used to see how well animals react to your character's actions, and how well your character can survive in the wilderness.</p>
                    <p>Perception is about how sensitive your character's attention to their surroundings is. It can represent physical senses as well as intuition about other creatures' true motivations. It is the check most often used to determine whether your character is surprised by an ambush (a bad thing).</p>
                    <p>Stealth is about how well your character can go unnoticed. It is usually used to hide or to move through an area without being heard, but can also represent things like getting lost in a crowd.</p>
                </section>
                <section>
                    <h3>Options Section</h3>
                    <p>Some special abilities don't need to be kept track of while actually playing the game, such as those that give you a permanent bonus to a statistic. Other abilities must be actively used or constantly kept track of. This section is a reminder about all of those options that your character has.</p>
                    <p>First are the Attacks your character can make in combat. Most of these require a Standard Action, but are listed separately from other Standard Actions because of their nature.</p>
                    <p>Standard Actions, Move Actions, Swift Actions, Opportunity Actions, and Free Actions are things you can do when the game is keeping very careful track of time, such as in combat. See the Combat rules for details about what these different kinds of actions mean. The character sheet in this area includes a reminder of options that are available to all characters, in addition to special abilities that only some creatures have.</p>
                    <p>Passive Features & Traits are advantages and disadvantages your character has in certain situations that don't require using an action.</p>
                    <p>Slower Features are things your character can do when they have more time&emdash;at least 5 minutes.</p>
                </section>
                <section>
                    <h3>Equipment Section</h3>
                    <p>This is for keeping track of stuff your character owns and/or carries around.</p>
                    <h4>Wealth</h4>
                    <p>At the top of the Equipment section is where you keep track of your money. Your Wealth score is displayed, and you can also Gain or Lose amounts of money here if you are using the regular dice roll rules for Wealth changes. (If you need to adjust your Wealth by a precise amount without rolling dice, that can be done on the Configure tab.)</p>
                    <h4>Inventory</h4>
                    <p>This area keeps track of your stuff, how hard it is to carry around, and its monetary value. You can click on an item to see more details about it and specify where your character is carrying it.</p>
                    <h4>Total Bulk Blurb</h4>
                    <p>This keeps track of the total amount of Bulk your character is carrying around, so you can see if you're close to incurring important penalties.</p>
                    <h4>Acquisition Center</h4>
                    <p>At the bottom of the Equipment section is where you can buy or "just acquire" items from the database, or "custom items" that you can define yourself, importing them into your Inventory and rolling to lose the appropriate amount of Wealth when neccessary.</p>
                </section>
            </section>
            <section>
                <h2>The Configure Tab</h2>
                <section>
                    <h3>Character Sheet Head</h3>
                    <p>The character's name, epithet, and XP are repeated here, but can be edited by clicking on them this time. There is also a checkbox that tells the site whether to treat the character as a monster.</p>
                </section>
                <section>
                    <h3>Good Save</h3>
                    <p>All characters get to start with a free +2 boost to one of these three saves (Fortitude, Reflex, or Willpower). This boost also helps you qualify for special abilities. The buttons on this part of the character sheet can be used to select this character's free boost.</p>
                </section>
                <section>
                    <h3>Breakdowns</h3>
                    <p>You can skip this section if you don't care to know how your character's stats are calculated.</p>
                    <p>The three Pools from the Play tab are broken down here on the left. On the right, <strong>Fighting Level</strong> is a measurement of your character's overall skill as a physical warrior; <strong>Caster Level</strong> is a measurement of overall magical ability; and <strong>Coast Number</strong> is a measurement of how cunning and good at using Skills your character is. It is used to determine the results of coasting die rolls (see <Link to="/rules/dice">Dice Mechanics</Link>). The character's Awesome Check (previously discussed on the Play tab) is also broken down here.</p>
                </section>
                <section>
                    <h3>Skill Ranks</h3>
                    <p>The ten Skills from the Play tab are improved by investing Ranks in them, one at a time. This section of the character sheet lets you designate where your Ranks go.</p>
                    <p>Skills can be either Trained or Untrained. Training a Skill gives you two "bonus" Ranks in that Skill, and also boosts your maximum ranks in that skill by two. All characters get two Skills Trained for free, which can be selected at the top of this section.</p>
                    <p>Characters gain five regular Skill Ranks at each Level. This part of the character sheet features a table where each individual Skill Rank can be selected. Note that a Skill cannot have more regular Ranks than your Level.</p>
                    <p>At the bottom of this section, a subsection entitled Synergy Bonuses may appear. Synergy Bonuses are special +1 or +2 bonuses to other statistics that are earned by investing a lot of Ranks in a related Skill. If a Skill has multiple Synergy Bonuses based on it, this section lets you choose one of those bonuses to be Primary, which reduces how many Ranks you need in the skill in order to enjoy the benefit. Note that most Synergy Bonuses depend on having specific special abilities, but the Brawn skill automatically gives synergy bonuses to Armor Value and Weapon Impact.</p>
                </section>
                <section>
                    <h3>Special Abilities</h3>
                    <p>Here is the meat of customizing your character&emdash;her Special Abilities that you select. There are three types of Special Abilities in CRE8.</p>
                    <p><strong>Kits</strong> are "packages" of abilities that fit well with each other. They provide your character's unifying themes and archetypes, which makes them the most similar to Classes from other TTRPGs. Selection menus for Kits are labeled in red.</p>
                    <p><strong>Feats</strong> are your character's "signature moves," usually mostly useful in combat. Most feats require spending a specific kind of action to use. A spellcaster's known Spells are one type of Feat.</p>
                    <p><strong>Talents</strong> are lesser abilities; anything that isn't a Kit or a Feat. They have a lot of variety. Some of them round out your character, giving him abilities that represent a life beyond adventuring (which he may or may not have abandoned). Note that Talents are the main way a character continues to progress beyond Level 8, and therefore become a lot more potent at that point.</p>
                </section>
            </section>
            <section>
                <h2>The Bio Tab</h2>
                <p>Here are a number of less-mechanical aspects of your character that you can define by clicking on their titles and typing in a description.</p>
                <p>For PCs, categories in this tab include Appearance & Physical Features; Summary of Personality; Motivations & Beliefs; Personal History; Relationships; and Tastes, Quirks, & Miscellaneous. Hopefully these are self-explanatory.</p>
                <p>The last category, "Non-Carried Property," can be used to detail a character's possessions that, for whatever reason, don't make sense to put in their Inventory. This especially applies to if they own some kind of house, castle, or other "home base," which can be described here.</p>
                <p>Monsters have their own categories on this tab: Appearance & Physical Features again; Personalily, Motivations, & Mentality; Habitat, Ecology, & Role; Combat Tactics; and Quirks & Miscellaneous.</p>
            </section>
        </>
    );
}

export default CharSheetTour;