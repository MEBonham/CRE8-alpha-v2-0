import React, { useState, useEffect, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import Accordion from '../ui/Accordion';
import AccordionSection from '../ui/AccordionSection';
import { traitDescriptions } from '../../helpers/TraitDescriptions';

const PlayAccordions = () => {
    const [state] = useContext(Store);

    const [traitsArr, setTraitsArr] = useState([]);
    useEffect(() => {
        if (state.cur) {
            setTraitsArr([
                ...state.cur.stats.traits_from_kits,
                ...state.cur.stats.traits_from_feats,
                ...state.cur.stats.traits_from_talents,
            ]);
        }
    }, [state.cur])

    return (
        <div className="play-accordions">
            <section>
                <h3>Attacks</h3>
                <Accordion uniqueKey={"meb_charAttacks"} cur={state.cur.id}>
                    {state.cur.stats.attacks.map((attackObj, i) => (
                        <AccordionSection>
                            <h4>{attackObj.name}</h4>
                            <>
                                {attackObj.impact}
                            </>
                        </AccordionSection>
                    ))}
                </Accordion>
            </section>
            <section>
                <h3>Other Features</h3>
                <Accordion uniqueKey={"meb_charOtherFeatures"} cur={state.cur.id}>
                    <AccordionSection>
                        <h4>Passive Features</h4>
                        <>
                            {state.cur.stats.passives.map((passiveFeature, i) => (
                                <p key={i}>{passiveFeature.text}</p>
                            ))}
                        </>
                    </AccordionSection>
                    <AccordionSection>
                        <h4>Extended Rests</h4>
                        <>
                            {state.cur.stats.extended_rest_actions.map((extendedRestFeature, i) => (
                                <p key={i}>{extendedRestFeature.text}</p>
                            ))}
                        </>
                    </AccordionSection>
                    {traitsArr.map((trait, i) => (
                        <AccordionSection key={i}>
                            <h4>{trait}</h4>
                            <>
                                <p>{traitDescriptions[trait]}</p>
                            </>
                        </AccordionSection>
                    ))}
                </Accordion>
            </section>
        </div>
    );
}

export default PlayAccordions;