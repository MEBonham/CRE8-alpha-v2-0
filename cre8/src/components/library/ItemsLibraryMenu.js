import React, { useContext } from 'react';

import { Store } from '../GlobalWrapper';
// import { wealthRoll } from '../../helpers/Roll';

const ItemsLibraryMenu = () => {
    const [state] = useContext(Store);

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
        1: "1 drink",
        2: "2.5 drinks",
        3: "4.8 drinks",
        4: "8.1 drinks",
        5: "13.1 drinks",
        6: "21 drinks",
        7: "32 drinks",
        8: "49 drinks",
        9: "75 drinks",
        10: "114 drinks",
        11: "172 drinks",
        12: "256 drinks"
    }

    const drinksToPrice = (ev) => {
        const d = parseFloat(ev.target.value);
        const p = 2.5 * Math.log(d) - 1.65;
        document.getElementById("meb_wealthScale_wealth").value = p;
    }

    const wealthToDrinks = (ev) => {
        const w = parseFloat(ev.target.value);
        const d = 1.95 * Math.pow(1.5, w);
        document.getElementById("meb_wealthScale_drinks").value = d;
    }

    return (
        <>
            <h2>Items</h2>
            {state.user && state.user.rank === "admin" ? 
                <>
                    <h3>Wealth Scale</h3>
                    {Object.keys(results).map((wealthNum) => (
                        <p>Wealth {wealthNum}: {results[wealthNum]}</p>
                    ))}
                    <br />
                    <p># drinks = ~1.95 * 1.5^w</p>
                    <p>Price of item = ~2.5 * ln(drinks) - 1.65</p>
                    <div>
                        <input
                            type="number"
                            id="meb_wealthScale_drinks"
                            onChange={drinksToPrice}
                            defaultValue="75"
                        />
                        <label>Number of drinks</label>
                    </div>
                    <div>
                        <input
                            type="number"
                            id="meb_wealthScale_wealth"
                            onChange={wealthToDrinks}
                            defaultValue="9"
                        />
                        <label>Price/Wealth score</label>
                    </div>
                </> :
                null
            }
        </>
    );
}

export default ItemsLibraryMenu;