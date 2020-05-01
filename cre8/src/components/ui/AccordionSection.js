import React, { Children } from 'react';

const AccordionSection = (props) => {
    const open = (props.openIndex === props.idx);
    const childArr = Children.toArray(props.children);
    const classes = open ? "toggles open rows" : "toggles rows";

    return (
        <div>
            <div onClick={props.toggle} id={`meb_accordionSection_${props.idx}_${props.uniqueKey}`} className="title">
                {childArr[0]}
            </div>
            <div className={classes}>
                {childArr[1]}
            </div>
        </div>
    );
}

export default AccordionSection;