import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

const RulesTOC = () => {
    const match = useRouteMatch();

    return (
        <>
            <h1>Rules of the Game</h1>
            <section>
                <h2>Introduction</h2>
                <ul>
                    <li><Link to={`${match.url}/ttrpgbasics`}>TTRPG Basics</Link></li>
                    <li><Link to={`${match.url}/dice`}>Dice Mechanics</Link></li>
                    <li><Link to={`${match.url}/introcre8`}>Introduction to CRE8</Link></li>
                    <li><Link to={`${match.url}/charsheettour`}>Character Sheet Tour</Link></li>
                </ul>
            </section>
            <section>
                <h2>Don't Know How To Organize These</h2>
                <ul>
                    <li><Link to={`${match.url}/conditions`}>Conditions</Link></li>
                    <li><Link to={`${match.url}/poison`}>Poison</Link></li>
                </ul>
            </section>
        </>
    );
}

export default RulesTOC;