import React from 'react';
// import { Link } from 'react-router-dom';

import MyLink from '../../../ui/MyLink';

const Xp = () => {
    return (
        <>
            <div className="float-right">
                <MyLink to="/rules">Back to Rules</MyLink>
            </div>
            <h1>XP and Advancement</h1>
            <p>It is sort of a trend in modern TTRPGs to ignore XP rules and just level up when the GM says so. However, in CRE8 we recommend sticking to the XP Rules. The game is designed for all PCs to be able to contribute even if they are not the same level, and the XP Parcels system becomes moot if you don't use XP.</p>
            <table>
                <thead>
                    <tr>
                        <th>Level</th>
                        <th>XP Required</th>
                        <th>XP until Next Level</th>
                        <th>XP Buffer at This Level</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>0</td>
                        <td>100</td>
                        <td>5</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>100</td>
                        <td>200</td>
                        <td>10</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>300</td>
                        <td>300</td>
                        <td>15</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>600</td>
                        <td>400</td>
                        <td>20</td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>1000</td>
                        <td>500</td>
                        <td>25</td>
                    </tr>
                    <tr>
                        <td>6</td>
                        <td>1500</td>
                        <td>600</td>
                        <td>30</td>
                    </tr>
                    <tr>
                        <td>7</td>
                        <td>2100</td>
                        <td>700</td>
                        <td>35</td>
                    </tr>
                    <tr>
                        <td>8</td>
                        <td>2800</td>
                        <td>800</td>
                        <td>40</td>
                    </tr>
                    <tr>
                        <td>9</td>
                        <td>3600</td>
                        <td>500</td>
                        <td>50</td>
                    </tr>
                    <tr>
                        <td>10</td>
                        <td>4100</td>
                        <td>500</td>
                        <td>60</td>
                    </tr>
                    <tr>
                        <td>11</td>
                        <td>4600</td>
                        <td>500</td>
                        <td>70</td>
                    </tr>
                    <tr>
                        <td>12</td>
                        <td>5100</td>
                        <td>500</td>
                        <td>80</td>
                    </tr>
                    <tr>
                        <td>13</td>
                        <td>etc.</td>
                        <td>500</td>
                        <td>etc.</td>
                    </tr>
                </tbody>
            </table>
            <section>
                <h2>Combat XP Distribution</h2>
                <p>Defeating hostile creatures in meaningful combat is the primary way to gain XP.</p>
                <p>Each defeated creature grants 40 XP per level of the creature. (This does not cap out at Level 8.) Sum up all the defeated creatures' XP Awards for a single combat encounter.</p>
                <p>Divide the total XP Award evenly between all of the encounter's victors. (Round down.)</p>
                <p>Before a Combat XP Award gets added to an individual victor's actual XP score, it is reduced by an amount called the victor's XP Buffer, which is shown on the table above. This represents how a character may not learn anything new from a very easy fight. If you use the "Earn XP" button on the Play tab of the automated character sheet, it will take care of subtracting the XP Buffer for you.</p>
                <h3>Example</h3>
                <p>A party of five adventurers (levels 4, 4, 4, 3, 3) is victorious in an epic battle against a level 5 warlock, a level 4 wyvern, a level 3 ogre, and six level 1 goblin bandits.</p>
                <p><strong>Step 1:</strong> The total XP for the encounter is (5 * 40) + (4 * 40) + (3 * 40) + (6 * 1 * 40) = 200 + 160 + 120 + 240 = 720.</p>
                <p><strong>Step 2:</strong> The amount of XP that goes toward each adventurer is (720 / 5) = 144.</p>
                <p><strong>Step 3:</strong> However, once Buffers are taken into account, the 4th-Level adventurers only increase by 124 XP, while the 3rd-level adventurers only increase by 129 XP.</p>
            </section>
            <section>
                <h2>XP Parcels</h2>
                <p>Characters who study overlapping subjects tend to learn a little more quickly than characters studying disparate, unrelated subjects. This leads to characters leveling up a little quicker if they follow an "archetype" that the rules encourage, as relayed by Kits' XP Parcels.</p>
                <p>When a character meets the requirements for an XP Parcel in one of his Kits, he gains a one-time bonus of 30 XP.</p>
            </section>
            <section>
                <h2>Other XP</h2>
                <p>The GM can, and probably should, give out XP awards for things other than combat and XP Parcels. This is especially true when a character makes some meaningful sacrifice for the sake of roleplaying true to their motivations.</p>
                <p>How <em>often</em> XP should be given out is very much up to the GM, who should attempt to make the characters' Levels jive with how mighty they are in the campaign's story.</p>
                <p>As a very loose guideline, accomplishing a minor goal or "side quest" should earn each PC 30 XP. Successfully completing an "adventure" should earn each PC 80 XP. A larger accomplishment than even an adventure should earn more XP, assuming the campaign isn't over, but the amount is left up to the GM.</p>
                <p>Accomplishing a PC's primary objective, like Inigo Montoya avenging his father by killing the six-fingered Count Rugen, can earn a large chunk of XP for just a single character. At higher levels, this could be an amount like 500 XP.</p>
                <p>Regardless of how mighty an accomplishment is achieved, the GM should never give out enough XP for a character to "level up" more than once simultaneously.</p>
            </section>
        </>
    );
}

export default Xp;