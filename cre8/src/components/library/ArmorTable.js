import React from 'react';
import { Link } from 'react-router-dom';

const ArmorTable = () => {

    // Protect against memory leak
    // const _isMounted = useRef(false);
    // useEffect(() => {
    //     _isMounted.current = true;
    //     return(() => {
    //         _isMounted.current = false;
    //     });
    // }, [])

    // const [allArmor, setAllArmor] = useState([]);
    // useEffect(() => {
    //     const loadFromDb = async () => {
    //         const allArmorCopy = [];
    //         try {
    //             const query = await fb.db.collection("items").get();
    //             query.forEach(doc => {
    //                 // console.log(doc.id, doc.data().tags);
    //                 if (doc.data().tags.includes("Armor")) {
    //                     const weaponObj = {
    //                         slug: doc.id,
    //                         name: doc.data().name,
    //                         price: doc.data().price,
    //                         bulk: doc.data().bulk,
    //                         heft: doc.data().weapon_heft,
    //                         grade: doc.data().weapon_grade
    //                     };
    //                     if (doc.data().attacks.length) {
    //                         weaponObj.impact = `${doc.data().attacks[0].impact_num_dice}d${doc.data().attacks[0].impact_dice_sides}`;
    //                         weaponObj.peril = `+${doc.data().attacks[0].peril_mod}`;
    //                         weaponObj.categories = doc.data().attacks[0].categories.join(", ").replace("MiscWeapon", "Other");
    //                         weaponObj.penetration = doc.data().attacks[0].detail.includes("penetration quality") ? true : false;
    //                         const dmgTypes = [];
    //                         const ranges = [];
    //                         doc.data().attacks.forEach((attackObj) => {
    //                             const dmgTypesArr = [];
    //                             if (attackObj.damage_type.base.bludgeoning) {
    //                                 dmgTypesArr.push("B");
    //                             }
    //                             if (attackObj.damage_type.base.piercing) {
    //                                 dmgTypesArr.push("P");
    //                             }
    //                             if (attackObj.damage_type.base.slashing) {
    //                                 dmgTypesArr.push("S");
    //                             }
    //                             if (dmgTypesArr.join("/") !== dmgTypes[0]) { dmgTypes.push(dmgTypesArr.join("/")); }
    //                             if (attackObj.range !== ranges[0]) { ranges.push(attackObj.range); }
    //                         });
    //                         weaponObj.dmgType = dmgTypes.join(" or\n");
    //                         weaponObj.range = ranges.join(" or\n");
    //                     }
    //                     allWeaponsCopy.push(weaponObj);
    //                 }
    //             });
    //             if (_isMounted.current) {
    //                 setAllWeapons(allWeaponsCopy);
    //             }
    //         } catch(err) {
    //             console.log("Database error:", err);
    //         }
    //     }
    //     loadFromDb();
    // }, [])

    return (
        <>
            <h2>Armor and Shields</h2>
            <table className="armorWeaponTable">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Bulk</th>
                        <th>Girth</th>
                        <th>Encumbrance</th>
                        <th>AV Bonus</th>
                        <th>Defense Bonus</th>
                        <th>Bash Impact</th>
                        <th>Special</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th colSpan="9" className="subtable">Armor</th>
                    </tr>
                    <tr>
                        <td className="pad-right">
                            <Link to="items/paddedarmor(nonproficient)">Padded Armor</Link>
                        </td>
                        <td className="numeric">8</td>
                        <td className="numeric">8</td>
                        <td>Light</td>
                        <td className="numeric">-1</td>
                        <td className="numeric">+1</td>
                        <td className="numeric"></td>
                        <td className="numeric"></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="pad-right">
                            <Link to="items/leatherarmor(nonproficient)">Leather Armor</Link>
                        </td>
                        <td className="numeric">9</td>
                        <td className="numeric">6</td>
                        <td>Light</td>
                        <td className="numeric">0</td>
                        <td className="numeric">+2</td>
                        <td className="numeric"></td>
                        <td className="numeric"></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="pad-right">
                            <Link to="items/chainmail(nonproficient)">Chainmail</Link>
                        </td>
                        <td className="numeric">12</td>
                        <td className="numeric">20</td>
                        <td>Heavy</td>
                        <td className="numeric">-3</td>
                        <td className="numeric">+3</td>
                        <td className="numeric"></td>
                        <td className="numeric"></td>
                        <td>Requires only Light proficiency</td>
                    </tr>
                    <tr>
                        <td className="pad-right">
                            <Link to="items/compositearmor(nonproficient)">Composite Armor</Link>
                        </td>
                        <td className="numeric">14</td>
                        <td className="numeric">22</td>
                        <td>Heavy</td>
                        <td className="numeric">-1</td>
                        <td className="numeric">+3</td>
                        <td className="numeric"></td>
                        <td className="numeric"></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="pad-right">
                            <Link to="items/platearmor(nonproficient)">Plate Armor</Link>
                        </td>
                        <td className="numeric">20</td>
                        <td className="numeric">24</td>
                        <td>Heavy</td>
                        <td className="numeric">-2</td>
                        <td className="numeric">+4</td>
                        <td className="numeric"></td>
                        <td className="numeric"></td>
                        <td></td>
                    </tr>
                </tbody>
                <tbody className="tbody-spacing" />
                <tbody>
                    <tr>
                        <th colSpan="9" className="subtable">Shields</th>
                    </tr>
                    <tr>
                        <td className="pad-right">
                            <Link to="items/buckler(nonproficient)">Buckler</Link>
                        </td>
                        <td className="numeric">8</td>
                        <td className="numeric">3</td>
                        <td></td>
                        <td className="numeric">0</td>
                        <td className="numeric"></td>
                        <td className="numeric">+2</td>
                        <td className="numeric">1d6</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="pad-right">
                            <Link to="items/fullshield(nonproficient)">Full Shield</Link>
                        </td>
                        <td className="numeric">9</td>
                        <td className="numeric">6</td>
                        <td></td>
                        <td className="numeric">-2</td>
                        <td className="numeric"></td>
                        <td className="numeric">+3</td>
                        <td className="numeric">1d10</td>
                        <td>Accuracy +1 to paired melee weapon</td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}

export default ArmorTable;