import React from 'react';
import MyLink from '../../../ui/MyLink';

const RPGBasics = () => {
    return (
        <>
            <div className="float-right">
                <MyLink to="/rules">Back to Rules</MyLink>
            </div>
            <h1>Tabletop RPG Basics</h1>
            <p>If you're already familiar with tabletop role-playing games ("TTRPGs"), you can probably skip this chapter.</p>
            <section>
                <h2>Group Storytelling</h2>
                <p>At its heart, a role-playing game is a group storytelling activity, like a children's make-believe game, but with more structure. Players start with a setting and some characters, and then they take turns contributing to what happens next. When someone tries to do something difficult or risky, dice are used to determine the outcome, which helps keep the story from being predictable. The goal is to make the ensuing story fun, memorable, and maybe even epic. Generally, this involves the protagonists going on dangerous adventures and having the opportunity to accomplish heroic deeds.</p>
            </section>
            <section>
                <h2>Roles: Players and Player Characters</h2>
                <p>All but one of the TTRPG's participants are called "players." Typically there are maybe 3-5 of these players, and each of them is in charge of one of the story's main protagonists. These protagonists are called "Player Characters" or <strong>PCs</strong>.</p>
            </section>
            <section>
                <h2>Role: the Game Master</h2>
                <p>The last participant in the game is the Game Master or <strong>GM</strong>. The GM plans, controls, and acts out the story's setting and characters, <em>except</em> for the PCs. The GM has a lot of responsibility to prepare the setting, make sure that the PCs' adventures aren't too easy or too hard, and to try to help everyone have fun. But leading a memorable game as a GM can also be very fun and satisfying.</p>
            </section>
            <section>
                <h2>Diversity</h2>
                <p>There is a lot of variety in how people play TTRPGs. Even the above statements are not set in stone in some more unusual TTRPGs! Even within a single ruleset such as CRE8, there is room for a number of different playstyles.</p>
                <p>Sometimes the story's setting is created by the GM independently (a "homebrew setting"). Other times the setting is drawn from a published resource, adapted from a novel, or otherwise comes from an external source.</p>
                <p>Sometimes the PCs have an obvious goal like "survive" or "save the world from the disease that turns everyone it touches into a sentient swarm of bugs." The GM may come up with this plot framework herself, or it can be guided by a published resource (known as a "module"). Other times, the PCs are allowed to basically follow their individual motivations and figure out what adventure they want to have. This is sometimes called a "sandbox game."</p>
                <p>TTRPGs may emphasize the "role-playing" aspect, or the opportunity to act out different personalities and social situations; or they may emphasize lethal action (combat), tactical thinking, and "optimized" character choices; or they may emphasize puzzle-like challenges and "thinking outside the box." Try to find a combination of game styles that allows all participants to enjoy what they're doing!</p>
            </section>
            <section>
                <h2>Other Jargon</h2>
                <p>TTRPGs are played in "blocks" called <strong>sessions</strong>. A session is typically 2-5 hours long.</p>
                <p>A complete story or game of a TTRPG is called a <strong>campaign</strong>. A campaign can be one session long, but more typically it involves many sessions, and can stretch to last for months or even years.</p>
                <p><strong>Campaign Setting:</strong> The world or universe in which the story takes place. In CRE8 it is intended to be a fantasy setting, but in other TTRPGs it could be a science fiction setting, a realistic setting, or something more unique.</p>
                <p><strong>Playgroup:</strong>All of the TTRPG's participants, including the GM (who is not a "player").</p>
                <p><strong>Game System:</strong> The set of rules that governs a TTRPG. The same ruleset is normally used for an entire campaign. This website is for the game system "CRE8".</p>
                <p><strong>Party</strong> or <strong>Adventuring Party:</strong> The group of PCs in a campaign.</p>
                <p><strong>NPC:</strong> Any character in the story who is not a PC. This is an acronym for "non-player character."</p>
                <p><strong>Adventure:</strong> A "chapter" of a campaign. It is typically a few sessions long.</p>
                <p><strong>Adventurer:</strong> A person who makes a career out of going on dangerous adventures. PCs are typically adventurers.</p>
                <p><strong>Backstory:</strong> Stuff that happened in the story before the start of the campaign, especially in a PC's personal history.</p>
                <p><strong>Rule Zero:</strong> The principle that the GM can override any of the game's normal rules in the interest of improving the story.  This may work in the PCs' favor, or it may work against them; it's all up to the GM. Players often have an easier time accepting a use of Rule Zero if the GM openly acknowledges she is invoking Rule Zero, and knows that she is not following the regular rules. The GM has the responsibility to use Rule Zero to make people have more fun, not as a power trip.</p>
            </section>
        </>
    );
}

export default RPGBasics;