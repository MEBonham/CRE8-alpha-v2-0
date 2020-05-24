import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
// import { wealthRoll } from '../../helpers/Roll';
import gc from '../../helpers/GameConstants';
import { ifPlus } from '../../helpers/Calculations';
import MyLink from '../ui/MyLink';

const ItemsLibraryMenu = () => {
    const [state, dispatch] = useContext(Store);

    // Protect against memory leak
    const _isMounted = useRef(false);
    useEffect(() => {
        _isMounted.current = true;
        return(() => {
            _isMounted.current = false;
        });
    }, [])

    const [allItems, setAllItems] = useState([]);
    useEffect(() => {
        const loadFromDb = async () => {
            const allItemsCopy = [];
            try {
                const query = await fb.db.collection("items").get();
                query.forEach(doc => {
                    allItemsCopy.push({
                        slug: doc.id,
                        name: doc.data().name,
                        tags: doc.data().tags,
                        price: doc.data().price,
                        bulk: doc.data().bulk,
                        hardness: doc.data().hardness,
                        resistance: doc.data().resistance,
                        structural_save: doc.data().structural_save
                    });
                });
                if (_isMounted.current) {
                    setAllItems(allItemsCopy);
                }
            } catch(err) {
                console.log("Database error:", err);
            }
        }
        loadFromDb();
    }, [])
    
    const [selectItems, setSelectItems] = useState([]);
    useEffect(() => {
        const selectItemsCopy = [];
        allItems.forEach((itemObj) => {
            let skip = false;
            if (state.itemFilters.oneTag && state.itemFilters.oneTag !== "false" && 
                !itemObj.tags.includes(state.itemFilters.oneTag)) skip = true;
            if (!skip) {
                selectItemsCopy.push({
                    ...itemObj
                });
            }
        });
        setSelectItems(
            selectItemsCopy.sort((a, b) => {
                if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
                if (a.name.toUpperCase() > b.name.toUpperCase()) return 1;
                return 0;
            })
        );
    }, [allItems, state.itemFilters])
    
    useEffect(() => {
        Object.keys(state.itemFilters).forEach((property) => {
            const el = document.getElementById(`meb_itemFilters_${property}`);
            if (el.type === "checkbox") {
                el.checked = state.itemFilters[property];
            } else {
                el.value = state.itemFilters[property];
            }
        });
    }, [state.itemFilters])

    useEffect(() => {
        if (selectItems) {
            dispatch({ type: "SET", key: "itemCycleLinks", payload:
                selectItems });
        }
    }, [selectItems, dispatch])

    const handleChange = (ev) => {
        const value = (ev.target.type === "checkbox") ? ev.target.checked : ev.target.value;
        const property = ev.target.id.split("_")[2];
        dispatch({ type: "SET", key: "itemFilters", payload: {
            ...state.itemFilters,
            [property]: value
        } });
    }

    // const iterations = 10000;
    // const results = {};
    // for (let i = 0; i < 12; i++) {
    //     let total = 0;
    //     for (let j = 0; j < iterations; j++) {
    //         let wealth = i + 1;
    //         let drinks = 0;
    //         while (wealth > 0) {
    //             const { finalWealth } = wealthRoll(wealth, -1, false);
    //             wealth = finalWealth;
    //             drinks++;
    //         }
    //         total += drinks;
    //     }
    //     results[i + 1] = total / iterations;
    // }
    const results = {
        1: "1.5 drinks",
        2: "3.75 drinks",
        3: "7.1 drinks",
        4: "12.2 drinks",
        5: "19.7 drinks",
        6: "31.1 drinks",
        7: "48.5 drinks",
        8: "74 drinks",
        9: "112 drinks",
        10: "172 drinks",
        11: "256 drinks",
        12: "384 drinks"
    }

    const drinksToPrice = (ev) => {
        const d = parseFloat(ev.target.value);
        const p = 2.5 * Math.log(d) - 2.86;
        document.getElementById("meb_wealthScale_wealth").value = p;
    }

    const wealthToDrinks = (ev) => {
        const w = parseFloat(ev.target.value);
        const d = 2.96 * Math.pow(1.5, w);
        document.getElementById("meb_wealthScale_drinks").value = d;
    }

    return (
        <section className="links columns space-between">
            <div className="rows">
                <h2>Items</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Price</th>
                            <th>Bulk</th>
                            <th>Hardness</th>
                            <th>Resistance</th>
                            <th>Structural Save</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectItems.map((itemObj) => (
                            <tr key={itemObj.slug}>
                                <td className="pad-right">
                                    <Link to={`items/${itemObj.slug}`}>{itemObj.name}</Link>
                                </td>
                                <td className="numeric">{itemObj.price}</td>
                                <td className="numeric">{itemObj.bulk}</td>
                                <td className="numeric">{itemObj.hardness}</td>
                                <td className="numeric">{itemObj.resistance}</td>
                                <td className="numeric">{ifPlus(parseInt(itemObj.structural_save))}{itemObj.structural_save}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <section className="bundles">
                    <h2>Item Bundles</h2>
                    <section>
                        <h3>Classic Adventuring Gear</h3>
                        <p>A traveler's outfit to wear; four pouches, a knife, and a waterskin attached to the outfit's belt or baldric for easy access; a large backpack containing a mess kit, a tinderbox, a trowel, four torches, three days' worth of trail rations, and a second traveler's outfit to change into; and a bedroll and 50-ft manila rope strapped to the outside of the backpack.</p>
                        <p><strong>Combined Price: 11. Total effective Bulk: 35.</strong> The backpack has additional room for 2 more bulk's worth of items, which will increase the effective carried Bulk by 1.</p>
                    </section>
                </section>
                {state.user && (state.user.rank === "admin" || state.user.rank === "archon") ? 
                    <section>
                        <h2>Wealth Scale</h2>
                        {Object.keys(results).map((wealthNum) => (
                            <p key={wealthNum}>Wealth {wealthNum}: {results[wealthNum]}</p>
                        ))}
                        <br />
                        <p># drinks = ~2.96 * 1.5^w</p>
                        <p>Price of item = ~2.5 * ln(drinks) - 2.86</p>
                        <div>
                            <input
                                type="number"
                                id="meb_wealthScale_drinks"
                                onChange={drinksToPrice}
                                defaultValue="256"
                            />
                            <label>Number of drinks</label>
                        </div>
                        <div>
                            <input
                                type="number"
                                id="meb_wealthScale_wealth"
                                onChange={wealthToDrinks}
                                defaultValue="11"
                            />
                            <label>Price/Wealth score</label>
                        </div>
                    </section> :
                    null
                }
            </div>
            <div className="filters rows">
                <select onChange={handleChange} id="meb_itemFilters_oneTag">
                    <option value={false}>Select Tag Filter</option>
                    {gc.item_tags.map((tagName) => (
                        <option key={tagName} value={tagName}>{tagName}</option>
                    ))}
                </select>
                <MyLink to="/library/weapons">Weapons Table</MyLink>
            </div>
        </section>
    );
}

export default ItemsLibraryMenu;