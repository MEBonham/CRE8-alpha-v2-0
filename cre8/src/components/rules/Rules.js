import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { Store } from '../GlobalWrapper';
import RulesTOC from './RulesTOC';
import RPGBasics from './chapters/intro/RPGBasics';
import DiceMechanics from './chapters/intro/DiceMechanics';
import IntroCRE8 from './chapters/intro/IntroCRE8';
import CharSheetTour from './chapters/intro/CharSheetTour';
import CharCreation from './chapters/creation/CharCreation';
import PreBuilt from './chapters/creation/PreBuilt';
import Xp from './chapters/creation/Xp';
import Retraining from './chapters/creation/Retraining';
import Initiative from './chapters/combat/Initiative';
import Attacks from './chapters/combat/Attacks';
import Conditions from './chapters/combat/Conditions';
import Momentum from './chapters/combat/Momentum';
import Resting from './chapters/exploration/Resting';
import PoisonRules from './chapters/other/PoisonRules';
import '../../css/rules.css';

const Rules = () => {
    const [, dispatch] = useContext(Store);
    const { chapter } = useParams();
    // Close menu that presumably led you here
    useEffect(() => {
        dispatch({ type: "SET", key: "mainNavMenuOpen", payload: false });
    }, [dispatch])

    const [chapterBody, setChapterBody] = useState(null);
    useEffect(() => {
        if (!chapter) {
            setChapterBody(<RulesTOC />);
        } else if (chapter === "ttrpgbasics") {
            setChapterBody(<RPGBasics />);
        } else if (chapter === "dice") {
            setChapterBody(<DiceMechanics />);
        } else if (chapter === "introcre8") {
            setChapterBody(<IntroCRE8 />);
        } else if (chapter === "charsheettour") {
            setChapterBody(<CharSheetTour />);
        } else if (chapter === "charcreation") {
            setChapterBody(<CharCreation />);
        } else if (chapter === "retraining") {
            setChapterBody(<Retraining />);
        } else if (chapter === "prebuilt") {
            setChapterBody(<PreBuilt />);
        } else if (chapter === "xp") {
            setChapterBody(<Xp />);
        } else if (chapter === "initiative") {
            setChapterBody(<Initiative />);
        } else if (chapter === "attacks") {
            setChapterBody(<Attacks />);
        } else if (chapter === "conditions") {
            setChapterBody(<Conditions />);
        } else if (chapter === "momentumexerting") {
            setChapterBody(<Momentum />);
        } else if (chapter === "resting") {
            setChapterBody(<Resting />);
        } else if (chapter === "poison") {
            setChapterBody(<PoisonRules />);
        }
    }, [chapter])

    return (
        <div className="primary-content content-padding rules">
            {chapterBody}
        </div>
    );
}

export default Rules;