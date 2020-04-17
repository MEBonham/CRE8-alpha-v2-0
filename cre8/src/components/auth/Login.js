import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import useGlobal from '../../hooks/useGlobal';

const Login = () => {

    const [user] = useGlobal("user");

    let component = user ? 
        <Redirect to="/" /> :
        <form className="login-form normal-padding">
            <h1>Login</h1>
            <label htmlFor="email">Email</label>
            <input
                type="email"
                id="email"
                // onChange={handleInputChange}
                // value={inputs.email || ""}
                required
            />
            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                // onChange={handleInputChange}
                // value={inputs.password || ""}
                required
            />
            <button type="submit">Login</button>
            {/* <p className="error-message buffer">{errorMessage}</p> */}
            <p className="buffer"><Link to="/login/forgot">Forgot password?</Link></p>
        </form>;

    return component;
}

export default Login;