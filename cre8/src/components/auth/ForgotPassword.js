import React, { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';

import useForm from '../../hooks/useForm';

const ForgotPassword = () => {
    const [state] = useContext(Store);
    const [errorMessage, setErrorMessage] = useState("");
    const [confirmMessage, setConfirmMessage] = useState("");

    const resetPw = async () => {
        try {
            await fb.auth.sendPasswordResetEmail(inputs.email)
            setConfirmMessage("Password Reset email sent.");
        } catch(err) {
                setErrorMessage("An error occurred. Please try again later.");
                console.log("Error:", err);
        };
    }
    const { inputs, handleInputChange, handleSubmit } = useForm(resetPw);

    const component = state.user ? 
        <Redirect to="/" /> :
        <form onSubmit={handleSubmit} className="primary-content content-padding login-form">
            <h1>Forgot Password</h1>
            <div>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    onChange={handleInputChange}
                    value={inputs.email || ""}
                    required
                />
            </div>
            <button type="submit">Reset Password</button>
            {errorMessage ? <p className="buffer-above error-message">{errorMessage}</p> : null}
            {confirmMessage ? <p className="buffer-above">{confirmMessage}</p> : null}
        </form>;

    return component;
}

export default ForgotPassword;