import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

const RulesTOC = () => {
    const match = useRouteMatch();

    return (
        <>
            <h1>Rules of the Game</h1>
            <section>
                <h2>Introduction</h2>
                <ul>
                    <li><Link to={`${match.url}/ttrpgbasics`}>TTRPG Basics</Link></li>
                    <li><Link to={`${match.url}/dice`}>Dice Mechanics</Link></li>
                    <li><Link to={`${match.url}/introcre8`}>Why Choose CRE8?</Link></li>
                    <li><Link to={`${match.url}/charsheettour`}>Character Sheet Tour</Link></li>
                </ul>
            </section>
            <section>
                <h2>Character Creation</h2>
                <ul>
                    <li><Link to={`${match.url}/charcreation`}>Creating a Character</Link></li>
                    <li><Link to={`${match.url}/prebuilt`}>Pre-Built Characters</Link></li>
                    <li><Link to={`${match.url}/xp`}>XP and Advancement</Link></li>
                    <li><Link to={`${match.url}/retraining`}>Retraining</Link></li>
                </ul>
            </section>
            <section>
                <h2>Combat</h2>
                <p>Getting into altercations tends to be a large fraction of what adventurers do in the course of completing their other objectives, and thus the rules for combat are fairly extensive. They deal with numerous dice rolls, as well as keeping track of creatures' position and timing rather precisely.</p>
                <ul>
                    <li><Link to={`${match.url}/initiative`}>Taking Turns: Initiative Order</Link></li>
                    <li><Link to={`${match.url}/combatactions`}>Combat Actions</Link></li>
                    <li><Link to={`${match.url}/combatmovement`}>Movement about the Battlefield</Link></li>
                    <li><Link to={`${match.url}/attacks`}>Attacking and Inflicting Hazards</Link></li>
                    <li><Link to={`${match.url}/damagehealing`}>Damage and Healing</Link></li>
                    <li><Link to={`${match.url}/specialattacks`}>Special Attacks</Link></li>
                    <li><Link to={`${match.url}/conditions`}>Conditions</Link></li>
                    <li><Link to={`${match.url}/momentumexerting`}>Momentum and Exerting</Link></li>
                    <li><Link to={`${match.url}/spellcasting`}>General Guide to Spellcasting</Link></li>
                </ul>
            </section>
            <section>
                <h2>Exploration and Social</h2>
                <ul>
                    <li><Link to={`${match.url}/resting`}>Short and Extended Rests</Link></li>
                    <li><Link to={`${match.url}/tasks`}>Various Tasks and their TNs</Link></li>
                    <li><Link to={`${match.url}/overlandmovement`}>Overland Movement</Link></li>
                    <li><Link to={`${match.url}/rituals`}>Guide to Rituals</Link></li>
                    <li><Link to={`${match.url}/environment`}>Environmental Conditions</Link></li>
                    <li><Link to={`${match.url}/traps`}>Traps</Link></li>
                    <li><Link to={`${match.url}/bustingobjects`}>Busting Objects</Link></li>
                </ul>
            </section>
            <section>
                <h2>Other Stuff that Can Happen</h2>
                <ul>
                    <li><Link to={`${match.url}/blight`}>Blight</Link></li>
                    <li><Link to={`${match.url}/buyingselling`}>Buying and Selling Equipment and Services</Link></li>
                    <li><Link to={`${match.url}/disease`}>Disease</Link></li>
                    <li><Link to={`${match.url}/encumbrance`}>Encumbrance</Link></li>
                    <li><Link to={`${match.url}/fear`}>Fear</Link></li>
                    <li><Link to={`${match.url}/illusions`}>Illusions</Link></li>
                    <li><Link to={`${match.url}/magicitems`}>Magic Items and Attunement</Link></li>
                    <li><Link to={`${match.url}/perksquirks`}>Magic Items: Perks and Quirks Menus</Link></li>
                    <li><Link to={`${match.url}/poison`}>Poison</Link></li>
                    <li><Link to={`${match.url}/spawns`}>Spawns</Link></li>
                    <li><Link to={`${match.url}/stooges`}>Stooges</Link></li>
                </ul>
            </section>
        </>
    );
}

export default RulesTOC;