// import { useState } from 'react';

const useForm = (cb, globalInputs, setGlobalInputs) => {
    // const [inputs, setInputs] = useState({});

    const handleSubmit = (ev) => {
        const savedCopy = {
            ...globalInputs
        };
        if (ev) {
            ev.preventDefault();
        }
        cb(ev, savedCopy);
    }

    const handleInputChange = (ev) => {
        ev.persist();
        const value = (ev.target.type === "checkbox") ? ev.target.checked : ev.target.value;
        // setInputs(inputs => ({
        //     ...inputs,
        //     [ev.target.id]: value
        // }));
        setGlobalInputs({
            ...globalInputs,
            [ev.target.id]: value
        });
    }

    return {
        handleSubmit,
        handleInputChange
    };
    // return {
    //     handleSubmit,
    //     handleInputChange,
    //     inputs,
    //     setInputs
    // };
}

export default useForm;