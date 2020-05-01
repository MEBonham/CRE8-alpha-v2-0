import React, { useState, useEffect, useRef, useContext } from 'react';

import { Store } from '../GlobalWrapper';
import { getDisplayName } from '../../helpers/Calculations';
import { traitDescriptions } from '../../helpers/TraitDescriptions';
import LoadingAlert from '../other/LoadingAlert';
import '../../css/library.css';

const SpecialPreview = () => {
    const [state, dispatch] = useContext(Store);
    const scrollContainer = useRef(null);
    const [fillerComponent, setFillerComponent] = useState(<LoadingAlert />);
    useEffect(() => {
        if (state.preview.data && state.preview.data.id) {
            switch(state.preview.type) {
                case "kits":
                    dispatch({ type: "SET", key: "previewComponent", payload: previewKit(state.preview.data) });
                    break;
                case "talents":
                    dispatch({ type: "SET", key: "previewComponent", payload: previewTalent(state.preview.data) });
                    break;
                default:
                    dispatch({ type: "SET", key: "previewComponent", payload: previewItem(state.preview.data) });
            }
        } else {
            setFillerComponent(null);
        }
    }, [dispatch, state.preview])

    useEffect(() => {
        if (state.previewComponent) {
            scrollContainer.current.scroll(0, 0);
        }
    }, [state.previewComponent])

    const previewKit = (data) => {
        console.log(data);
        return(
            <>
                <h1>{data.name}</h1>
                <h2 className="subtitle">[{data.tags.map((tag) => (tag)).join("] [")}] Kit</h2>
                <p><strong>Prerequisites:</strong> {data.prereqs}</p>
                <h2>Benefits:</h2>
                <ul>
                    {data.fighting_level_boost ?
                        <li>Fighting Level +1</li> :
                    null}
                    {data.caster_level_boost ?
                        <li>Caster Level +1</li> :
                    null}
                    {data.coast_number_boost ?
                        <li>Coast Number +1</li> :
                    null}
                    {data.fighting_OR_caster_boost ?
                        <li>Fighting Level +1 <span className="or">or</span> Caster Level +1</li> :
                    null}
                    {data.fighting_OR_coast_boost ?
                        <li>Fighting Level +1 <span className="or">or</span> Coast Number +1</li> :
                    null}
                    {data.caster_OR_coast_boost ?
                        <li>Caster Level +1 <span className="or">or</span> Coast Number +1</li> :
                    null}
                    {data.vpPlus2_OR_mpPlus2 ?
                        <li>VP +2 <span className="or">or</span> MP +2</li> :
                    null}
                    {data.bonus_talents.map((talent, i) => (
                        <li key={i}>Gain a bonus [{
                            Object.keys(talent).map((descriptor) => (
                                talent[descriptor].join("] or [")
                            ))
                        }] talent.</li>
                    ))}
                    {data.bonus_trained_skills.map((training, i) => {
                        if (training.type === "fullMenu") {
                            return (<li key={i}>Train an additional skill.</li>)
                        } else if (training.type === "specific") {
                            return (<li key={i}>Train {training.options[0]}. If {training.options[0]} is already trained, you may immediately retrain that trained skill.</li>)
                        } else {
                            return (<li key={i}>Train {training.options.join(" or ")}.</li>)
                        }
                    })}
                    {data.various_bonuses.map((modObj, i) => {
                        if (modObj.type === "Synergy") {
                            return (<li key={i}>
                                Gain a{modObj.skill === "Athletics" ? "n" : null} {modObj.skill}-based
                                synergy bonus to your {getDisplayName(modObj.to)}.
                            </li>);
                        } else if (modObj.num > 0) {
                            return (<li key={i}>
                                Gain a +{modObj.num} {modObj.type} bonus to your {getDisplayName(modObj.to)}.
                            </li>);
                        } else {
                            return null;
                        }
                    })}
                    {data.benefit_traits.map((trait, i) => (
                        <li key={i}><strong>{trait}:</strong> {traitDescriptions[trait]}</li>
                    ))}
                    {data.passives.map((passive, i) => (
                        <li key={i}>{passive}</li>
                    ))}
                    {data.extended_rest_actions.map((restAction, i) => (
                        <li key={i}>Extended Rest: {restAction}</li>
                    ))}
                </ul>
                {data.drawback_traits.length ?
                    <>
                        <h2>Drawbacks:</h2>
                        <ul>
                            {data.drawback_traits.map((trait, i) => (
                                <li key={i}><strong>{trait}:</strong> {traitDescriptions[trait]}</li>
                            ))}
                        </ul>
                    </> :
                null}
                {data.xp_parcels.length ?
                    <>
                        <h2>XP Parcels:</h2>
                        <ul>
                            {data.xp_parcels.map((parcel, i) => (
                                <li key={i}>{parcel}</li>
                            ))}
                        </ul>
                    </> :
                null}
            </>
        );
    }

    const previewTalent = (data) => {
        return(
            <>
                <h1>{data.name}</h1>
                <h2 className="subtitle">[{data.tags.map((tag) => (tag)).join("] [")}] Talent</h2>
                <p><strong>Prerequisites:</strong> {data.prereqs}</p>
                <h2>Benefits:</h2>
                <ul>
                    {data.various_bonuses.map((modObj, i) => {
                        if (modObj.type === "Synergy") {
                            return (<li key={i}>
                                Gain a{modObj.skill === "Athletics" ? "n" : null} {modObj.skill}-based
                                synergy bonus to your {getDisplayName(modObj.to)}.
                            </li>);
                        } else if (modObj.num > 0) {
                            return (<li key={i}>
                                Gain a +{modObj.num} {modObj.type} bonus to your {getDisplayName(modObj.to)}.
                            </li>);
                        } else {
                            return null;
                        }
                    })}
                    {data.benefit_traits.map((trait, i) => (
                        <li key={i}><strong>{trait}:</strong> {traitDescriptions[trait]}</li>
                    ))}
                    {data.passives.map((passive, i) => (
                        <li key={i}>{passive}</li>
                    ))}
                    {data.extended_rest_actions.map((restAction, i) => (
                        <li key={i}>Extended Rest: {restAction}</li>
                    ))}
                </ul>
            </>
        );
    }

    const previewItem = (data) => {
        return(
            <>
                <h1>{data.name}</h1>
            </>
        );
    }

    return (
        <div className="library-display" ref={scrollContainer}>
            {state.previewComponent ? state.previewComponent : fillerComponent}
        </div>
    );
}

export default SpecialPreview;