import React, { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import fb from '../../fbConfig';
import { Context } from '../GlobalWrapper';

import useForm from '../../hooks/useForm';

const ForgotPassword = () => {

    const [{ user }] = useContext(Context);
    const [errorMessage, setErrorMessage] = useState("");
    const [ confirmMessage, setConfirmMessage ] = useState("");

    const resetPw = () => {
        fb.auth.sendPasswordResetEmail(inputs.email)
            .then(() => {
                setConfirmMessage("Password Reset email sent.");
            })
            .catch(err => {
                setErrorMessage("An error occurred. Please try again later.");
                console.log("Error:", err);
            });
    }
    
    const { inputs, handleInputChange, handleSubmit } = useForm(resetPw);

    let component = user ? 
        <Redirect to="/" /> :
        <form onSubmit={handleSubmit} className="login-form normal-padding">
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
            <p className="error-message buffer">{errorMessage}</p>
            <p className="buffer">{confirmMessage}</p>
        </form>;

    return component;
}

export default ForgotPassword;