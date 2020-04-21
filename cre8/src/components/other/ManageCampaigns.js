import React, { useState, useEffect, useRef, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Context } from '../GlobalWrapper';
import fb from '../../fbConfig';
import useForm from '../../hooks/useForm';

import MyButton from '../ui/MyButton';

const ManageCampaigns = () => {
    const [{ user, activeCampaigns }, dispatch] = useContext(Context);
    const db = fb.db;
    // const [userInfo] = useGlobal("user");
    // const [usersCampaigns, setUsersCampaigns] = useGlobal("usersCampaigns");

    const [usersObj, setUsersObj] = useState([]);
    const usersStream = useRef(null);
    useEffect(() => {        
        usersStream.current = db.collection("users")
            .get().then(querySnapshot => {
                const usersData = {};
                querySnapshot.forEach(userDatum => {
                    const userDatumDefaulted = {
                        campaigns: [],
                        ...userDatum.data()
                    };
                    usersData[userDatum.id] = userDatumDefaulted;
                });
                setUsersObj(usersData);
            });
    }, [db, user]);

    const getDisplayNameFromId = (id) => {
        if (usersObj && usersObj[id]) {
            return usersObj[id].displayName;
        } else {
            return "";
        }
    }
    const otherUsersList = (usersAlreadyIds) => {
        return Object.keys(usersObj).filter(id => (
            usersAlreadyIds.indexOf(id) === -1
        )).map(id => ({
            ...usersObj[id],
            uid: id
        }));
    }
    
    const saveNewCampaign = () => {
        const id = uuidv4();
        db.collection("campaigns").doc(id).set({
            owner: user.uid,
            name: newInputs.newCampaignName,
            members: [user.uid]
        })
        .then(() => {
            dispatch({ type: "SET", key: "activeCampaigns", payload: {
                ...activeCampaigns,
                [id]: {
                    owner: user.uid,
                    name: newInputs.newCampaignName,
                    members: [user.uid]
                }
            } });
        })
        .catch(err => {
            console.log(err);
        });
    }
    const saveNewForm = useForm(saveNewCampaign);
    const newInputs = saveNewForm.inputs;
    const newHandleInputChange = saveNewForm.handleInputChange;
    const newHandleSubmit = saveNewForm.handleSubmit;
    
    const [selectVals, setSelectVals] = useState([]);
    const handleSelectChangeById = (ev) => {
        const newArr = selectVals.slice();
        newArr[ev.target.id.split("_")[1]] = ev.target.value;
        setSelectVals(newArr);
    }
    const addNewPlayer = (ev) => {
        const idsArr = ev.target.id.split("_");
        const selectVal = selectVals[idsArr[1]];
        if (selectVal) {
            db.collection("campaigns").doc(idsArr[2]).get()
                .then(doc => {
                    const prevMembers = doc.data().members;
                    db.collection("campaigns").doc(idsArr[2])
                        .set({
                            members: [
                                ...prevMembers,
                                selectVal
                            ]
                        }, { merge: true })
                        .then(() => {
                            // console.log(usersCampaigns);
                            dispatch({ type: "SET", key: "activeCampaigns", payload: {
                                ...activeCampaigns,
                                [idsArr[2]]: {
                                    ...activeCampaigns[idsArr[2]],
                                    members: [
                                        ...prevMembers,
                                        selectVal
                                    ]
                                }
                            } });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    return(
        <section className="manage-campaigns">
            <h2>Your Campaigns</h2>
            {Object.keys(activeCampaigns).map((campaignId, i) => {
                const campaignData = activeCampaigns[campaignId];
                return(
                    <section key={campaignId} className="one-campaign">
                        <h3>{campaignData.name}</h3>
                        <div>
                            <select id={`addusers_${i}`} onChange={handleSelectChangeById}>
                                <option value="Select User">Select User</option>
                                {otherUsersList(campaignData.members).map(userObj => {
                                    return <option key={userObj.uid} value={userObj.uid}>{userObj.displayName}</option>
                                })}
                            </select>
                            <MyButton fct={addNewPlayer} evData={`add-player-to-campaign_${i}_${campaignId}`}>Add Player</MyButton>
                        </div>
                        <ul>
                            {campaignData.members.map(memberId => (
                                <li key={`${i}-${memberId}`}>
                                    {getDisplayNameFromId(memberId)}
                                </li>
                            ))}
                        </ul>
                    </section>
                );
            })}
            <section>
                <h3>Create New Campaign</h3>
                <form onSubmit={newHandleSubmit}>
                    <div>
                        <label htmlFor="newCampaignName">Name</label>
                        <input
                            type="text"
                            id="newCampaignName"
                            onChange={newHandleInputChange}
                            value={newInputs.newCampaignName || ""}
                            required
                        />
                    </div>
                    <button type="submit">Save</button>
                </form>
            </section>
        </section>
    );
}

export default ManageCampaigns;