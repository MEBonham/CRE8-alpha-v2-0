import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import useForm from '../../hooks/useForm';

const Login = () => {
    const [, dispatch] = useContext(Store);
    // Close menu that presumably led you here
    useEffect(() => {
        dispatch({ type: "SET", key: "userSettingsMenuOpen", payload: false });
    }, [dispatch])

    const navHistory = useHistory();
    const signIn = async (ev) => {
        try {
            await fb.auth.signInWithEmailAndPassword(inputs.email, inputs.password);
            navHistory.goBack();
        } catch(err) {
            if (err.code && (err.code === "auth/user-not-found" || err.code === "auth/wrong-password")) {
                setErrorMessage("Invalid email or password.");
            } else {
                setErrorMessage("Error signing in. Please try again later.");
                console.log("Miscellaneous error signing in.", err);
            }
        }
    }
    
    const [errorMessage, setErrorMessage] = useState("");
    const { inputs, handleInputChange, handleSubmit } = useForm(signIn);

    return (
        <form onSubmit={handleSubmit} className="primary-content content-padding login-form">
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
            {errorMessage ? <p className="buffer-above error-message">{errorMessage}</p> : null}
        </form>
    )
}

export default Login;