import React, { useState, useEffect } from 'react';

const Testing = () => {
    const [val, setVal] = useState(null);
    useEffect(() => {
        setVal(4);
    }, [])

    const setTo7 = (ev) => {
        setVal(7);
    }

    return (
        <>
            <p>{val}</p>
            <button onClick={setTo7}>Click me</button>
        </>
    );
}

export default Testing;