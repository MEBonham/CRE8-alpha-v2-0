import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import useForm from '../../hooks/useForm';

const Register = () => {
    const [state, dispatch] = useContext(Store);
    // Close menu that presumably led you here
    useEffect(() => {
        dispatch({ type: "SET", key: "userSettingsMenuOpen", payload: false });
    }, [dispatch])
    
    const [errorMessage, setErrorMessage] = useState("");

    const db = fb.db;
    const [prevUsernames, setPrevUserNames] = useState([]);
    const [streamOpened, setStreamOpened] = useState(false);
    useEffect(() => {
        let _isMounted = true;
        db.collection("users")
            // .onSnapshot(querySnapshot => {
            .get()
            .then(querySnapshot => {
                const usernames = ["Select User"];
                querySnapshot.forEach(doc => {
                    usernames.push(doc.data().displayName);
                });
                if (_isMounted) {
                    setPrevUserNames(usernames);
                    setStreamOpened(true);
                }
            })
            .catch((err) => {
                if (_isMounted) {
                    setErrorMessage(err.message || err);
                    setStreamOpened(false);
                }
            });
        return(() => {
            _isMounted = false;
        });
    }, [db, streamOpened]);

    const navHistory = useHistory();
    const registerFct = (ev) => {
        if (!streamOpened) {
            return;
        } else if (prevUsernames.includes(inputs.username)) {
            if (inputs.username === "Select User") {
                setErrorMessage("Stop trying to hack my system, you jerk!")
            } else {
                setErrorMessage("Duplicate username. Please try again.")
            }
        } else {
            fb.auth.createUserWithEmailAndPassword(inputs.email, inputs.password)
                .then(() => {
                    const { uid } = fb.auth.currentUser;
                    const displayName = inputs.username;
                    db.collection("users").doc(uid).set({
                        displayName,
                        email: inputs.email,
                        rank: "peasant"
                    }).then(() => {
                        fb.auth.currentUser.updateProfile({
                            displayName
                        })
                        .then(() => {
                            navHistory.goBack();
                        })
                        .catch((err) => {
                            console.log("Error:", err);
                        });
                    }).catch((err) => {
                        console.log("Error:", err);
                    });
                }).catch((err) => {
                    if (err.code && err.code === "auth/email-already-in-use") {
                        setErrorMessage("Email already in use.");
                    } else if (err.code && err.code === "auth/weak-password") {
                        setErrorMessage("Password too weak; please provide at least 6 characters.");
                    } else {
                        setErrorMessage("Error registering. Please try again later.");
                        console.log("Misc. error registering user:", err);
                    }
                });
        }
    }
    const { inputs, handleInputChange, handleSubmit } = useForm(registerFct);

    const component = state.user ? <Redirect to="/" /> :
        (<form onSubmit={handleSubmit} className="primary-content content-padding login-form rows">
            <h1>Register</h1>
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
            <div>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    onChange={handleInputChange}
                    value={inputs.username || ""}
                    required
                />
            </div>
            <button type="submit">Register</button>
            {errorMessage ? <p className="buffer-above error-message">{errorMessage}</p> : null}
        </form>);
    return (component)
}

export default Register;