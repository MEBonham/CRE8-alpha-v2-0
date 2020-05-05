import React, { useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import MyLink from '../ui/MyLink';

const Bestiary = () => {
    const [state, dispatch] = useContext(Store);
    // Close menu that presumably led you here
    useEffect(() => {
        dispatch({ type: "SET", key: "mainNavMenuOpen", payload: false });
    }, [dispatch])

    const gatherChars = useCallback(async () => {
        const saveCharsToArr = (querySnapshot) => {
            const charsData = [];
            querySnapshot.forEach(doc => {
                charsData.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            dispatch({ type: "SAVE_CHARACTERS_TO_CACHE", payload: charsData });
        }
        try {
            const query = await fb.db.collection("characters").get();
            saveCharsToArr(query);
        } catch(err) {
            console.log("Error:", err);
        }
    }, [dispatch]);
    useEffect(() => {
        if (state.shouldUpdateCharacterCache) {
            gatherChars();
        }
    }, [gatherChars, state.shouldUpdateCharacterCache])

    // Alphabetize characters
    const compareFct = (a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
    }

    return(
        <div className="primary-content content-padding char-library">
            <section className="rows">
                <h1>Bestiary</h1>
                <MyLink to="/characters/new">New Monster</MyLink>
            </section>
            <section>
                {state.characterCache.filter(charData => charData.campaigns.includes("standard")).sort(compareFct)
                    .map(charData => {
                        const toAddress = `/bestiary/${charData.id}`;
                        return (
                            <p key={charData.id}>
                                <Link to={toAddress}>{charData.name}</Link>
                            </p>
                        );
                    })
                }
            </section>
        </div>
    );
}

export default Bestiary;