import React, { createContext, useReducer, useEffect, useRef } from 'react';

import useFormWContext from '../../hooks/useFormWContext';

const reducer = (state, action) => {
    switch (action.type) {
        // case 'SET_ERRORS':
        //     return {
        //         ...state,
        //         errors: action.payload,
        //     };
        case 'SET_INPUTS':
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    ...action.payload,
                },
            };
        case 'INITIALIZE':
            return {
                ...state,
                ...action.payload,
                inputs: {
                    ...action.payload.inputs,
                    ...action.values
                }
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

const Form = ({ children, onSubmit, defaultValues, ...otherProps }) => {
    const [state, dispatch] = useReducer(reducer, {});
    const formData = useFormWContext(onSubmit, state, dispatch);
    const formDataRef = useRef(formData);
    // const { inputs, handleInputChange, handleSubmitPassInputs, setInputs } = useForm(onSubmit);

    useEffect(() => {
        dispatch({ type: "INITIALIZE", payload: formDataRef.current, values: defaultValues });
        // dispatch({ type: "SET_INPUTS", payload: defaultValues });
    }, [defaultValues, dispatch, onSubmit])
    
    if (!state.handleSubmit) return <h1>Loading ...</h1>;
    return (
        <FormFcts.Provider value={[state, dispatch]}>
            <form onSubmit={state.handleSubmit.bind(null, state.inputs)} {...otherProps}>
                {children}
            </form>
        </FormFcts.Provider>
    );
}

export default Form;