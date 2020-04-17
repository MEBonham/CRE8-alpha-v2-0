import React from 'react';
import { Redirect } from 'react-router-dom';
import useGlobal from '../../hooks/useGlobal';

const Register = () => {

    const [user] = useGlobal("user");

    let component = user ? 
        <Redirect to="/" /> :
        <form className="register-form normal-padding">
            <h1>Register</h1>
        </form>;

    return component;
}

export default Register;