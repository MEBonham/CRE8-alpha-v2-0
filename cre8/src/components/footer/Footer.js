import React from 'react';

import gyzLogo from '../../media/GyzaninarLogo.png';

import '../../css/footer.css';

const Footer = () => {

    const d = new Date();

    return(
        <footer>
            <div className="copyright">
                <p>&copy; {d.getFullYear()} Gyzaninar Games <strong>&middot;</strong></p>
                <img src={gyzLogo} alt="logo" />
            </div>
            
        </footer>
    );
}

export default Footer;