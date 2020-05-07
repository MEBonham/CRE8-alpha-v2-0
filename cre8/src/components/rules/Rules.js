import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import RulesTOC from './RulesTOC';
import Conditions from './chapters/Conditions';
import PoisonRules from './chapters/PoisonRules';

const Rules = () => {
    const { chapter } = useParams();
    const [chapterBody, setChapterBody] = useState(null);
    useEffect(() => {
        if (!chapter) {
            setChapterBody(<RulesTOC />);
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