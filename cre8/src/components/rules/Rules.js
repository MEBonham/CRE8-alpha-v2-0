import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import RulesTOC from './RulesTOC';
import RPGBasics from './chapters/intro/RPGBasics';
import DiceMechanics from './chapters/intro/DiceMechanics';
import IntroCRE8 from './chapters/intro/IntroCRE8';
import CharSheetTour from './chapters/intro/CharSheetTour';
import Conditions from './chapters/Conditions';
import PoisonRules from './chapters/PoisonRules';

const Rules = () => {
    const { chapter } = useParams();
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
        } else if (chapter === "conditions") {
            setChapterBody(<Conditions />);
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