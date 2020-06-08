import React from 'react';
// import { Link } from 'react-router-dom';

import MyLink from '../../../ui/MyLink';

const Xp = () => {
    return (
        <>
            <div className="float-right">
                <MyLink to="/rules">Back to Rules</MyLink>
            </div>
            <h1>Pre-Built Characters</h1>
            <p>Here are a few popular fantasy character archetypes, and a recommended set of instructions for how to build them in CRE8. A few choices will be left up to you to make your character feel individual, but most of your choices are provided.</p>
            <section>
                <h2>Fighter</h2>
                <h3>Level 1</h3>
                <p>Choose Fortitude as your Strongest Save. Choose Athletics and Brawn as your Trained Skills. Put one more Rank into Brawn, Charisma, Gadgetry, Nature, and Stealth. Choose Weapon Impact for your Primary Synergy Bonus for Brawn.</p>
                <p>Choose a Kit to represent your character's race: Dwarf, Elf, Halfling, Human Paragon, or Orc. If you picked Human Paragon, choose Rhino's Charge as your bonus Feat.</p>
                <p>For your first Talent, choose something to represent what your character did before adventuring: Artisan, Engineering, Farmer, or Sailor. If you chose Artisan, select any specialty under that Talent.</p>
                <p>Choose Soldier for your second Kit. Under Soldier, select Fighting Level +1. Choose Toughness for your Feat. For your remaining Talents, choose Bestride, Martial Proficiency, and Shield Proficiency. Under Martial Proficiency, choose Heavy Blades.</p>
                <p>For equipment, buy a Full Shield (proficient) and Leather Armor (proficient). Then an Arming Sword. Then buy what you can afford from the Classic Adventuring Gear bundle. If you were very lucky with your purchases and still have enough Wealth remaning, buy a Shortbow and some Arrows.</p>
                <p>Don't forget to tell the character sheet that you are Wearing your clothing and Leather Armor, and Wielding your Full Shield and Arming Sword. Put most of your other Equipment in a Backpack or Pouches.</p>
            </section>
        </>
    );
}

export default Xp;