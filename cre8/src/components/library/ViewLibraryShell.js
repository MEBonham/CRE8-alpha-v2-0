import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import SpecialPreview from './SpecialPreview';
import MyLink from '../ui/MyLink';
import Code404 from '../other/Code404';

const ViewLibraryShell = () => {
    const [state, dispatch] = useContext(Store);
    const { category, slug } = useParams();

    // Protect against memory leak
    const _isMounted = useRef(false);
    useEffect(() => {
        _isMounted.current = true;
        return(() => {
            _isMounted.current = false;
        });
    }, [])

    const [code404, setCode404] = useState(false);
    useEffect(() => {
        const loadDataFromDb = async () => {
            try {
                const doc = await fb.db.collection(category).doc(slug).get();
                if (doc.exists) {
                    dispatch({ type: "SET", key: "preview", payload: {
                        type: category,
                        data: {
                            id: slug,
                            ...doc.data()
                        }
                    } });
                } else {
                    if (_isMounted.current) {
                        setCode404(true);
                    }
                }
            } catch(err) {
                console.log("Database error:", err);
            }
        }
        loadDataFromDb();
    }, [category, dispatch, slug])

    const [nextLink, setNextLink] = useState(null);
    const [prevLink, setPrevLink] = useState(null);
    useEffect(() => {
        switch (category) {
            case "kits":
                if (state.kitCycleLinks) {
                    for (let i = 0; i < state.kitCycleLinks.length; i++) {
                        if (slug === state.kitCycleLinks[i].slug) {
                            setNextLink(i === state.kitCycleLinks.length - 1 ?
                                state.kitCycleLinks[0] : state.kitCycleLinks[i + 1]);
                            setPrevLink(i === 0 ? state.kitCycleLinks[state.kitCycleLinks.length - 1] : state.kitCycleLinks[i - 1]);
                        }
                    }
                }
                break;
            case "feats":
                if (state.featCycleLinks) {
                    for (let i = 0; i < state.featCycleLinks.length; i++) {
                        if (slug === state.featCycleLinks[i].slug) {
                            setNextLink(i === state.featCycleLinks.length - 1 ?
                                state.featCycleLinks[0] : state.featCycleLinks[i + 1]);
                            setPrevLink(i === 0 ? state.featCycleLinks[state.featCycleLinks.length - 1] : state.featCycleLinks[i - 1]);
                        }
                    }
                }
                break;
            case "talents":
                if (state.talentCycleLinks) {
                    for (let i = 0; i < state.talentCycleLinks.length; i++) {
                        if (slug === state.talentCycleLinks[i].slug) {
                            setNextLink(i === state.talentCycleLinks.length - 1 ?
                                state.talentCycleLinks[0] : state.talentCycleLinks[i + 1]);
                            setPrevLink(i === 0 ? state.talentCycleLinks[state.talentCycleLinks.length - 1] : state.talentCycleLinks[i - 1]);
                        }
                    }
                }
                break;
            default:
                if (state.itemCycleLinks) {
                    for (let i = 0; i < state.itemCycleLinks.length; i++) {
                        if (slug === state.itemCycleLinks[i].slug) {
                            setNextLink(i === state.itemCycleLinks.length - 1 ?
                                state.itemCycleLinks[0] : state.itemCycleLinks[i + 1]);
                            setPrevLink(i === 0 ? state.itemCycleLinks[state.itemCycleLinks.length - 1] : state.itemCycleLinks[i - 1]);
                        }
                    }
                }
                break;
        }
    }, [category, slug, state.featCycleLinks, state.itemCycleLinks, state.kitCycleLinks, state.talentCycleLinks])

    if (code404) return <Code404 from="ViewLibraryShell" />
    return (
        <div className="view-library-shell primary-content content-padding">
            {prevLink && nextLink ?
                <div className="carousel-nav columns">
                    <div>
                        <MyLink to={`/library/${category}/${prevLink.slug}`}>{`<`}</MyLink>
                        <p>{prevLink.name}</p>
                    </div>
                    <div>
                        <MyLink to={`/library/${category}/${nextLink.slug}`}>></MyLink>
                        <p>{nextLink.name}</p>
                    </div>
                </div> :
            null}
            <SpecialPreview />
            <MyLink to="/library">Back to Library</MyLink>
        </div>
    );
}

export default ViewLibraryShell;