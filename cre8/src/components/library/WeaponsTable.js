import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import fb from '../../fbConfig';

const WeaponsTable = () => {

    // Protect against memory leak
    const _isMounted = useRef(false);
    useEffect(() => {
        _isMounted.current = true;
        return(() => {
            _isMounted.current = false;
        });
    }, [])

    const [allWeapons, setAllWeapons] = useState([]);
    useEffect(() => {
        const loadFromDb = async () => {
            const allWeaponsCopy = [];
            try {
                const query = await fb.db.collection("items").get();
                query.forEach(doc => {
                    // console.log(doc.id, doc.data().tags);
                    if (doc.data().tags.includes("Weapon")) {
                        const weaponObj = {
                            slug: doc.id,
                            name: doc.data().name,
                            price: doc.data().price,
                            bulk: doc.data().bulk,
                            heft: doc.data().weapon_heft,
                            grade: doc.data().weapon_grade
                        };
                        if (doc.data().attacks.length) {
                            weaponObj.impact = `${doc.data().attacks[0].impact_num_dice}d${doc.data().attacks[0].impact_dice_sides}`;
                            weaponObj.peril = `+${doc.data().attacks[0].peril_mod}`;
                            weaponObj.categories = doc.data().attacks[0].categories.join(", ").replace("MiscWeapon", "Other");
                            weaponObj.penetration = doc.data().attacks[0].detail.includes("penetration quality") ? true : false;
                            const dmgTypes = [];
                            const ranges = [];
                            doc.data().attacks.forEach((attackObj) => {
                                const dmgTypesArr = [];
                                if (attackObj.damage_type.base.bludgeoning) {
                                    dmgTypesArr.push("B");
                                }
                                if (attackObj.damage_type.base.piercing) {
                                    dmgTypesArr.push("P");
                                }
                                if (attackObj.damage_type.base.slashing) {
                                    dmgTypesArr.push("S");
                                }
                                if (dmgTypesArr.join("/") !== dmgTypes[0]) { dmgTypes.push(dmgTypesArr.join("/")); }
                                if (attackObj.range !== ranges[0]) { ranges.push(attackObj.range); }
                            });
                            weaponObj.dmgType = dmgTypes.join(" or\n");
                            weaponObj.range = ranges.join(" or\n");
                        }
                        allWeaponsCopy.push(weaponObj);
                    }
                });
                if (_isMounted.current) {
                    setAllWeapons(allWeaponsCopy);
                }
            } catch(err) {
                console.log("Database error:", err);
            }
        }
        loadFromDb();
    }, [])

    return (
        <>
            <h2>Weapons</h2>
            <table className="armorWeaponTable">
                <thead>
                    <tr>
                        <th>Weapon</th>
                        <th>Price</th>
                        <th>Bulk</th>
                        <th>Base Impact</th>
                        <th>Damage Type(s)</th>
                        <th>Peril Mod</th>
                        <th>Range(s)</th>
                        <th>Heft</th>
                        <th>Categories</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th colSpan="9" className="subtable">Simple Weapons</th>
                    </tr>
                    {allWeapons.filter((weaponObj) => weaponObj.grade === "simple").map((weaponObj) => (
                        <tr key={weaponObj.slug}>
                            <td className="pad-right">
                                <Link to={`items/${weaponObj.slug}`}>{weaponObj.name}</Link>
                            </td>
                            <td className="numeric">{weaponObj.price}</td>
                            <td className="numeric">{weaponObj.bulk}</td>
                            <td className="numeric">{weaponObj.impact}{weaponObj.penetration ? `*` : null}</td>
                            <td className="numeric" style={{ whiteSpace: 'pre-line', width: '1%' }}>{weaponObj.dmgType}</td>
                            <td className="numeric">{weaponObj.peril}</td>
                            <td style={{ whiteSpace: 'pre-line', width: "27%" }}>{weaponObj.range}</td>
                            <td className="numeric">{weaponObj.heft}</td>
                            <td className="numeric">{weaponObj.categories}</td>
                        </tr>
                    ))}
                </tbody>
                <tbody className="tbody-spacing" />
                <tbody>
                    <tr>
                        <th colSpan="9" className="subtable">Martial Weapons</th>
                    </tr>
                    {allWeapons.filter((weaponObj) => weaponObj.grade === "martial").map((weaponObj) => (
                        <tr key={weaponObj.slug}>
                            <td className="pad-right">
                                <Link to={`items/${weaponObj.slug}`}>{weaponObj.name}</Link>
                            </td>
                            <td className="numeric">{weaponObj.price}</td>
                            <td className="numeric">{weaponObj.bulk}</td>
                            <td className="numeric">{weaponObj.impact}{weaponObj.penetration ? `*` : null}</td>
                            <td className="numeric" style={{ whiteSpace: 'pre-line', width: '1%' }}>{weaponObj.dmgType}</td>
                            <td className="numeric">{weaponObj.peril}</td>
                            <td style={{ whiteSpace: 'pre-line', width: "27%" }}>{weaponObj.range}</td>
                            <td className="numeric">{weaponObj.heft}</td>
                            <td className="numeric">{weaponObj.categories}</td>
                        </tr>
                    ))}
                </tbody>
                <tbody className="tbody-spacing" />
                <tbody>
                    <tr>
                        <th colSpan="9" className="subtable">Exotic Weapons</th>
                    </tr>
                    {allWeapons.filter((weaponObj) => weaponObj.grade === "exotic").map((weaponObj) => (
                        <tr key={weaponObj.slug}>
                            <td className="pad-right">
                                <Link to={`items/${weaponObj.slug}`}>{weaponObj.name}</Link>
                            </td>
                            <td className="numeric">{weaponObj.price}</td>
                            <td className="numeric">{weaponObj.bulk}</td>
                            <td className="numeric">{weaponObj.impact}{weaponObj.penetration ? `*` : null}</td>
                            <td className="numeric" style={{ whiteSpace: 'pre-line', width: '1%' }}>{weaponObj.dmgType}</td>
                            <td className="numeric">{weaponObj.peril}</td>
                            <td style={{ whiteSpace: 'pre-line', width: "27%" }}>{weaponObj.range}</td>
                            <td className="numeric">{weaponObj.heft}</td>
                            <td className="numeric">{weaponObj.categories}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default WeaponsTable;