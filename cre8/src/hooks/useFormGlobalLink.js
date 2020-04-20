
const useForm = (cb, globalInputs, setGlobalInputs) => {

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
        setGlobalInputs({
            ...globalInputs,
            [ev.target.id]: value
        });
    }

    return {
        handleSubmit,
        handleInputChange
    };
}

export default useForm;