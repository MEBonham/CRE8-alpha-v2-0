import React, { useState, useEffect, useRef, useContext } from 'react';

import { FormFcts } from './Form';

const Field = ({ name, as, type, children, radioValue, ...otherProps }) => {
    const [state] = useContext(FormFcts);
    const [component, setComponent] = useState(null);
    const otherPropsRef = useRef(otherProps);

    useEffect(() => {
        switch (as) {
            case "textarea":
                setComponent(
                    <textarea
                        name={name}
                        onChange={state.handleInputChange}
                        value={state.inputs[name] || ""}
                        {...otherPropsRef.current}
                    />
                );
                break;
            case "select":
                setComponent(
                    <select
                        name={name}
                        onChange={state.handleInputChange}
                        value={state.inputs[name] || false}
                        {...otherPropsRef.current}
                    >
                        {children}
                    </select>
                );
                break;
            default:
                switch (type) {
                    case "checkbox":
                        setComponent(
                            <input
                                type="checkbox"
                                name={name}
                                onChange={state.handleInputChange}
                                value={name || true}
                                {...otherPropsRef.current}
                            />
                        );
                        break;
                    case "radio":
                        setComponent(
                            <input
                                type="radio"
                                name={name}
                                onChange={state.handleInputChange}
                                value={radioValue}
                                {...otherPropsRef.current}
                            />
                        );
                        break;
                    default:
                        setComponent(
                            <input
                                type={type}
                                name={name}
                                onChange={state.handleInputChange}
                                value={state.inputs[name] || ""}
                                {...otherPropsRef.current}
                            />
                        );
                }
        }
    }, [as, children, name, radioValue, state.handleInputChange, state.inputs, type])

    return (component);
}

export default Field;