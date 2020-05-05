import React, { useState, useEffect, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import Accordion from '../ui/Accordion';
import AccordionSection from '../ui/AccordionSection';
import { traitDescriptions } from '../../helpers/TraitDescriptions';
import { ifPlus } from '../../helpers/Calculations';
import { defaultActions } from '../../helpers/DefaultActions';

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
                    {state.cur.stats.attacks.filter((attackObj) => attackObj.name !== "Unarmed Strike").map((attackObj, i) => (
                        <AccordionSection key={i}>
                            <h4>{attackObj.name}</h4>
                            <>
                                <p><strong>Range:</strong> {attackObj.range}</p>
                                <p>
                                    <strong>Impact:</strong> {attackObj.impact_num_dice}d{attackObj.impact_dice_sides}{attackObj.impact_total_mod ? `${ifPlus(attackObj.impact_total_mod)}${attackObj.impact_total_mod}` : null} ({attackObj.damage_type.base.join("/")} damage)
                                </p>
                                <p><strong>Accuracy:</strong> {attackObj.accuracy}</p>
                                <p><strong>Peril Rating:</strong> {attackObj.peril_rating}</p>
                                {attackObj.detail ? <p>{attackObj.detail}</p> : null}
                            </>
                        </AccordionSection>
                    ))}
                    {state.cur.stats.attacks.filter((attackObj) => attackObj.name === "Unarmed Strike").map((attackObj, i) => (
                        <AccordionSection key={i}>
                            <h4>{attackObj.name}</h4>
                            <>
                                <p><strong>Range:</strong> {attackObj.range}</p>
                                <p>
                                    <strong>Impact:</strong> {attackObj.impact_num_dice}d{attackObj.impact_dice_sides}{attackObj.impact_total_mod ? `${ifPlus(attackObj.impact_total_mod)}${attackObj.impact_total_mod}` : null} ({attackObj.damage_type.base.join("/")} damage)
                                </p>
                                <p><strong>Accuracy:</strong> {attackObj.accuracy}</p>
                                <p><strong>Peril Rating:</strong> {attackObj.peril_rating}</p>
                                {attackObj.detail ? <p>{attackObj.detail}</p> : null}
                            </>
                        </AccordionSection>
                    ))}
                </Accordion>
            </section>
            <section>
                <h3>Standard Actions</h3>
                <Accordion uniqueKey={"meb_charStandards"} cur={state.cur.id}>
                    {state.cur.stats.standard_actions.map((standardAction, i) => (
                        <AccordionSection key={i}>
                            <h4>{standardAction.displaySource}</h4>
                            <>
                                <p>{standardAction.text}</p>
                            </>
                        </AccordionSection>
                    ))}
                    <AccordionSection>
                        <h4>Default Options</h4>
                        <>
                            {defaultActions.standard.map((action, i) => (
                                <p key={i}>{action}</p>
                            ))}
                        </>
                    </AccordionSection>
                    <AccordionSection>
                        <h4>Special Attacks</h4>
                        <>
                            {defaultActions.special_attacks.map((action, i) => (
                                <p key={i}>{action}</p>
                            ))}
                        </>
                    </AccordionSection>
                </Accordion>
            </section>
            <section>
                <h3>Move Actions</h3>
                <Accordion uniqueKey={"meb_charMoves"} cur={state.cur.id}>
                    {state.cur.stats.move_actions.map((moveAction, i) => (
                        <AccordionSection key={i}>
                            <h4>{moveAction.displaySource}</h4>
                            <>
                                <p>{moveAction.text}</p>
                            </>
                        </AccordionSection>
                    ))}
                    <AccordionSection>
                        <h4>Default Options</h4>
                        <>
                            {defaultActions.move.map((action, i) => (
                                <p key={i}>{action}</p>
                            ))}
                        </>
                    </AccordionSection>
                    <AccordionSection>
                        <h4>Maneuvers</h4>
                        <>
                            {defaultActions.maneuvers.map((action, i) => (
                                <p key={i}>{action}</p>
                            ))}
                        </>
                    </AccordionSection>
                </Accordion>
            </section>
            <section>
                <h3>Swift Actions</h3>
                <Accordion uniqueKey={"meb_charSwifts"} cur={state.cur.id}>
                    {state.cur.stats.swift_actions.map((swiftAction, i) => (
                        <AccordionSection key={i}>
                            <h4>{swiftAction.displaySource}</h4>
                            <>
                                <p>{swiftAction.text}</p>
                            </>
                        </AccordionSection>
                    ))}
                    <AccordionSection>
                        <h4>Default Options</h4>
                        <>
                            {defaultActions.swift.map((action, i) => (
                                <p key={i}>{action}</p>
                            ))}
                        </>
                    </AccordionSection>
                </Accordion>
            </section>
            <section>
                <h3>Opportunity Actions</h3>
                <Accordion uniqueKey={"meb_charOpportunities"} cur={state.cur.id}>
                    {state.cur.stats.opportunity_actions.map((opportunityAction, i) => (
                        <AccordionSection key={i}>
                            <h4>{opportunityAction.displaySource}</h4>
                            <>
                                <p>{opportunityAction.text}</p>
                            </>
                        </AccordionSection>
                    ))}
                    <AccordionSection>
                        <h4>Default Options</h4>
                        <>
                            {defaultActions.opportunity.map((action, i) => (
                                <p key={i}>{action}</p>
                            ))}
                        </>
                    </AccordionSection>
                </Accordion>
            </section>
            <section>
                <h3>Free Actions</h3>
                <Accordion uniqueKey={"meb_charFree"} cur={state.cur.id}>
                    {state.cur.stats.free_actions.map((freeAction, i) => (
                        <AccordionSection key={i}>
                            <h4>{freeAction.displaySource}</h4>
                            <>
                                <p>{freeAction.text}</p>
                            </>
                        </AccordionSection>
                    ))}
                    <AccordionSection>
                        <h4>Default Options</h4>
                        <>
                            {defaultActions.free.map((action, i) => (
                                <p key={i}>{action}</p>
                            ))}
                        </>
                    </AccordionSection>
                </Accordion>
            </section>
            <section>
                <h3>Other Features</h3>
                <Accordion uniqueKey={"meb_charOtherFeatures"} cur={state.cur.id}>
                    <AccordionSection>
                        <h4>Passive Features</h4>
                        <>
                            {state.cur.stats.passives.map((passiveFeature, i) => (
                                <p key={i}>
                                    {passiveFeature.text.startsWith("[DRAWBACK]") ? 
                                        passiveFeature.text.split(" ").slice(1).join(" ") :
                                        passiveFeature.text
                                    }
                                </p>
                            ))}
                        </>
                    </AccordionSection>
                    <AccordionSection>
                        <h4>Short Rests</h4>
                        <>
                            {state.cur.stats.short_rest_actions.map((shortRestFeature, i) => (
                                <p key={i}>{shortRestFeature.text}</p>
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