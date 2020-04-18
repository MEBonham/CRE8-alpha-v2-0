import { useState } from 'react';

const useForm = (cb) => {
    const [inputs, setInputs] = useState({});

    const handleSubmit = (ev) => {
        if (ev) {
            ev.preventDefault();
        }
        cb();
    }

    const handleInputChange = (ev) => {
        ev.persist();
        const value = (ev.target.type === "checkbox") ? ev.target.checked : ev.target.value;
        setInputs(inputs => ({
            ...inputs,
            [ev.target.id]: value
        }));
    }

    return {
        handleSubmit,
        handleInputChange,
        inputs,
        setInputs
    };
}

export default useForm;