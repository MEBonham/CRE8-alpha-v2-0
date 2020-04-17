import React from 'react';

import '../../css/footer.css';

const Footer = () => {

    const d = new Date();

    return(
        <footer>
            <p>&copy; {d.getFullYear()} Gyzaninar Games</p>
        </footer>
    );
}

export default Footer;