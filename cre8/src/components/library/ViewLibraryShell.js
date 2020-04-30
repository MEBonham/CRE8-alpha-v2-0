import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import SpecialPreview from './SpecialPreview';
import Code404 from '../other/Code404';

const ViewLibraryShell = () => {
    const [, dispatch] = useContext(Store);
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

    if (code404) return <Code404 from="ViewLibraryShell" />
    return (
        <div className="primary-content content-padding">
            <SpecialPreview />
        </div>
    );
}

export default ViewLibraryShell;