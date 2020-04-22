import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Store } from '../GlobalWrapper';

// import Listener from './Listener';
import profileButton from '../../media/profile-icon.png';

const SignedOut = () => {
    const [state, dispatch] = useContext(Store);
    // const MILLISECOND_TOLERANCE = 20;
    // const [userSettingsMenuOpen, setUserSettingsMenuOpen] = useState(false);
    // const openMenu = (ev) => {
    //     if (Date.now() - lastClick > MILLISECOND_TOLERANCE) {
    //         setUserSettingsMenuOpen(true);
    //     }
    // }
    const toggle = (ev) => {
        dispatch({ type: "SET", key: "userSettingsMenuOpen", payload: !state.userSettingsMenuOpen });
    }

    return (
        <div className="profile signed-out">
            {/* <img onClick={openMenu} src={profileButton} alt="User Menu" /> */}
            <img onClick={toggle} src={profileButton} alt="User Menu" />
            {state.userSettingsMenuOpen ?
                <nav>
                    <NavLink to="/login">Login</NavLink>
                    <NavLink to="/register">Register</NavLink>
                </nav> : null}
        </div>
    );
}

export default SignedOut;