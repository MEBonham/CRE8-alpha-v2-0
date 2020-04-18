import React, { useState, useEffect } from 'react';
import { Redirect, Link, useHistory } from 'react-router-dom';
import useGlobal from '../../hooks/useGlobal';
import fb from '../../fbConfig';

import useForm from '../../hooks/useForm';

const Login = () => {

    const [returnToHistory, setReturnToHistory] = useState(false);
    const navHistory = useHistory();
    useEffect(() => {
        if (returnToHistory) {
            navHistory.goBack();
        }
    }, [ navHistory, returnToHistory ])

    const [user] = useGlobal("user");
    const [errorMessage, setErrorMessage] = useState("");

    const signIn = () => {
        fb.auth.signInWithEmailAndPassword(inputs.email, inputs.password)
            .then(() => {
                setReturnToHistory(true);
            })
            .catch(err => {
                if (err.code && (err.code === "auth/user-not-found" || err.code === "auth/wrong-password")) {
                    setErrorMessage("Invalid email or password.");
                } else {
                    setErrorMessage("Error signing in. Please try again later.");
                    console.log("Miscellaneous error signing in.", err);
                }
            });
    }
    
    const { inputs, handleInputChange, handleSubmit } = useForm(signIn);

    let component = user ? 
        <Redirect to="/" /> :
        <form onSubmit={handleSubmit} className="login-form normal-padding">
            <h1>Login</h1>
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
            <div>
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    onChange={handleInputChange}
                    value={inputs.password || ""}
                    required
                />
            </div>
            <button type="submit">Login</button>
            <p className="error-message buffer">{errorMessage}</p>
            <p className="buffer"><Link to="/login/forgot">Forgot password?</Link></p>
        </form>;

    return component;
}

export default Login;