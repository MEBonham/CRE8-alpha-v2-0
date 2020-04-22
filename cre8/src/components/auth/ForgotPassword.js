import React, { useState, useEffect, useRef } from 'react';
import fb from '../../fbConfig';

import useForm from '../../hooks/useForm';

const ForgotPassword = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [confirmMessage, setConfirmMessage] = useState("");

    const _isMounted = useRef(false);
    useEffect(() => {
        _isMounted.current = true;
        return (() => {
            _isMounted.current = false;
        });
    }, [])

    const resetPw = async () => {
        try {
            await fb.auth.sendPasswordResetEmail(inputs.email)
            if (_isMounted) setConfirmMessage("Password Reset email sent. Assuming Google's API worked. I've found it unreliable.");
        } catch(err) {
            if (_isMounted) {
                setErrorMessage("An error occurred. Please try again later.");
                console.log("Error:", err);
            }
        };
    }
    const { inputs, handleInputChange, handleSubmit } = useForm(resetPw);

    return (
        <form onSubmit={handleSubmit} className="primary-content content-padding login-form rows">
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
        </form>
    );
}

export default ForgotPassword;