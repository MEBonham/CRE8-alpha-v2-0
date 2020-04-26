import { useState, useEffect } from 'react';

const useLsPersistedState = (key, defaultValue=null) => {
    const [value, setValue] = useState(() => {
        const stickyValue = window.localStorage.getItem(key);

        return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}

export default useLsPersistedState;