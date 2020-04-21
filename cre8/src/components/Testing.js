import React, { useState, useEffect } from 'react';

const Testing = () => {
    const [val, setVal] = useState(null);
    useEffect(() => {
        setVal("boring default data");
    }, [])

    const setTo7 = (ev) => {
        setVal("important data");
    }

    return (
        <>
            <p>{val}</p>
            <button onClick={setTo7}>Click me</button>
        </>
    );
}

export default Testing;