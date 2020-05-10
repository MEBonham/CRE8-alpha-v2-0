// import { useState } from 'react';

const useForm = (cb, dispatch) => {
    // const [inputs, setInputs] = useState({});

    const handleSubmit = (inputs, ev) => {
        if (ev) {
            ev.preventDefault();
        }
        cb(ev, inputs);
    }

    const handleInputChange = (ev) => {
        ev.persist();
        const value = (ev.target.type === "checkbox") ? ev.target.checked : ev.target.value;
        dispatch({ type: "SET_INPUTS", payload: { [ev.target.name]: value } });
    }

    return {
        handleSubmit,
        handleInputChange
    };
}

export default useForm;