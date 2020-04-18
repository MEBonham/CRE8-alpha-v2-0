import React, { useState, useEffect, useRef } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import useGlobal from '../../hooks/useGlobal';
import fb from '../../fbConfig';

import useForm from '../../hooks/useForm';

const Register = () => {

    const [returnToHistory, setReturnToHistory] = useState(false);
    const navHistory = useHistory();
    useEffect(() => {
        if (returnToHistory) {
            navHistory.goBack();
        }
    }, [ navHistory, returnToHistory ])

    const [user] = useGlobal("user");
    const stream = useRef(null);
    const [prevUsernames, setPrevUserNames] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    let unsubscribe = false;

    useEffect(() => {
        if (unsubscribe) {
            return () => {
                unsubscribe();
            };
        }
    }, [unsubscribe])

    const db = fb.db;

    useEffect(() => {
        stream.current = db.collection("users")
            .onSnapshot(querySnapshot => {
                const usernames = [];
                querySnapshot.forEach(doc => {
                    usernames.push(doc.data().displayName);
                });
                setPrevUserNames(usernames);
            });
    
        return () => {
            stream.current();
        };
    }, [db]);

    const addUserToDb = () => {
        const { uid, email } = fb.auth.currentUser;
        const displayName = inputs.username;
        const data = {
            displayName,
            email,
            rank: "peasant"
        };
        db.collection("users").doc(uid).set(data)
            .then(() => {
                unsubscribe = fb.auth.currentUser.updateProfile({
                    displayName
                })
                .then(() => {
                    setReturnToHistory(true);
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    const registerFct = () => {
        fb.auth.createUserWithEmailAndPassword(inputs.email, inputs.password)
            .then(() => {
                addUserToDb();
            })
            .catch(err => {
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

    const checkUsername = () => {
        if (!stream.current) {
            return;
        } else if (prevUsernames.indexOf(inputs.username) >= 0) {
            setErrorMessage("Duplicate username. Please try again.");
        } else {
            registerFct();
        }
    }
    
    const { inputs, handleInputChange, handleSubmit } = useForm(checkUsername);

    let component = user ? <Redirect to="/" /> : 
        <form onSubmit={handleSubmit} className="register-form normal-padding">
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
            {errorMessage ? <p className="error-message buffer">{errorMessage}</p> : null}
        </form>;

    return component;
}

export default Register;