import React, { Children, cloneElement } from 'react';

import useLsPersistedState from '../../hooks/useLsPersistedState';

const Accordion = ({ children, uniqueKey, cur }) => {
    const [openIndex, setOpenIndex] = useLsPersistedState(uniqueKey, false);
    const [openIndexObj, setOpenIndexObj] = useLsPersistedState(`${uniqueKey}_byChar`, {});

    const toggle = (ev) => {
        const clickedIndex = parseInt(ev.currentTarget.id.split("_")[2]);
        if (cur) {
            if (clickedIndex === openIndexObj[cur]) {
                setOpenIndexObj({
                    ...openIndexObj,
                    [cur]: false
                });
            } else {
                setOpenIndexObj({
                    ...openIndexObj,
                    [cur]: clickedIndex
                });
            }
        } else {
            if (clickedIndex === openIndex) {
                setOpenIndex(false);
            } else {
                setOpenIndex(clickedIndex);
            }
        }
    }
    const effIndex = cur ? openIndexObj[cur] : openIndex;

    return (
        <div className="accordion">
            {Children.map(children, (child, i) => (
                cloneElement(child, {
                    openIndex: effIndex,
                    toggle,
                    uniqueKey,
                    idx: i
                })
            ))}
        </div>
    );
}

export default Accordion;