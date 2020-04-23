
const useFormGlobalScope = (cb, globalInputs, dispatchInputsFct) => {

    const handleSubmit = (ev) => {
        if (ev) {
            ev.preventDefault();
        }
        cb(ev, globalInputs);
    }

    const handleInputChange = (ev) => {
        ev.persist();
        const value = (ev.target.type === "checkbox") ? ev.target.checked : ev.target.value;
        dispatchInputsFct({ type: "SET", key: "inputs", payload: {
            ...globalInputs,
            [ev.target.id]: value
        } });
    }

    return {
        handleSubmit,
        handleInputChange
    };
}

export default useFormGlobalScope;