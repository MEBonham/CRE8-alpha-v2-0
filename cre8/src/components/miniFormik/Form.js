import React, { createContext, useReducer, useEffect, useRef } from 'react';

import useFormWContext from '../../hooks/useFormWContext';

const reducer = (state, action) => {
    switch (action.type) {
        // case 'SET_ERRORS':
        //     return {
        //         ...state,
        //         errors: action.payload,
        //     };
        case 'INITIALIZE':
            return {
                ...state,
                ...action.payload,
                inputs: {
                    ...action.payload.inputs,
                    ...action.values
                }
            };
        case 'RESET':
            return {
                ...state,
                inputs: {
                    ...action.payload
                }
            }
        case 'SET_INPUTS':
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    ...action.payload,
                },
            };
        // case 'SET_FIELD_TOUCHED':
        //     return {
        //         ...state,
        //         touched: {
        //             ...state.touched,
        //             ...action.payload,
        //         },
        //     };
        // case 'SUBMIT_ATTEMPT':
        //     return {
        //         ...state,
        //         isSubmitting: true,
        //         touched: setNestedObjectValues(state.values, true),
        //     };
        // case 'SUBMIT_SUCCESS':
        //     return {
        //         ...state,
        //         isSubmitting: false,
        //     };
        // case 'SUBMIT_FAILURE':
        //     return {
        //         ...state,
        //         isSubmitting: false,
        //         submitError: action.payload,
        //     };
        default:
            return state;
    }
}

export const FormFcts = createContext({});

const Form = ({ children, onSubmit, defaultValues, reset, sections, ...otherProps }) => {
    const [state, dispatch] = useReducer(reducer, {});
    const formData = useFormWContext(onSubmit, dispatch);
    const formDataRef = useRef(formData);

    useEffect(() => {
        Object.keys(defaultValues).forEach((inputName) => {
            let el = document.querySelectorAll(`input[name="${inputName}"]`);
            if (el.length && el[0].type === "checkbox") {
                el[0].defaultChecked = !!defaultValues[inputName];
            } else if (el.length && el[0].type === "radio") {
                el.forEach((radioInput) => {
                    radioInput.defaultChecked = (defaultValues[inputName] === radioInput.value);
                });
            } else if (el.length) {
                el[0].defaultValue = defaultValues[inputName];
            }
            el = document.querySelector(`select[name="${inputName}"]`);
            if (el && el.multiple) {
                const options = el.querySelectorAll("option");
                options.forEach((optionEl) => {
                    optionEl.selected = (el.value.includes(optionEl.value));
                });
            } else if (el) {
                const options = el.querySelectorAll("option");
                options.forEach((optionEl) => {
                    optionEl.selected = (el.value === optionEl.value);
                });
            }
        });
        dispatch({ type: "INITIALIZE", payload: formDataRef.current, values: defaultValues });
    }, [defaultValues, dispatch])
    
    if (!state.handleSubmit) return <h1>Loading ...</h1>;
    return (
        <FormFcts.Provider value={[state, dispatch]}>
            {/* <p>{JSON.stringify(state.inputs, null, 2)}</p> */}
            <form onSubmit={state.handleSubmit.bind(null, state.inputs, reset, defaultValues)} {...otherProps}>
                {children}
            </form>
        </FormFcts.Provider>
    );
}

export default Form;