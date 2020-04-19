import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import fb from '../../fbConfig';
import useGlobal from '../../hooks/useGlobal';
import useForm from '../../hooks/useForm';

import MyButton from '../ui/MyButton';

const ManageCampaigns = () => {

    const db = fb.db;
    const [userInfo] = useGlobal("user");

    const [campaigns, setCampaigns] = useState([]);
    const [usersObj, setUsersObj] = useState([]);
    const campaignStream = useRef(null);
    const usersStream = useRef(null);
    useEffect(() => {
        
        campaignStream.current = db.collection("campaigns")
            // .onSnapshot(querySnapshot => {
            .get().then(querySnapshot => {
                const campaignData = [];
                querySnapshot.forEach(campaign => {
                    campaignData.push({
                        id: campaign.id,
                        ...campaign.data()
                    });
                });
                setCampaigns(campaignData.filter(campaignObj => campaignObj.members.indexOf(userInfo.uid) >= 0));
            });
        
        usersStream.current = db.collection("users")
            // .onSnapshot(querySnapshot => {
            .get().then(querySnapshot => {
                const usersData = {};
                querySnapshot.forEach(userDatum => {
                    const userDatumDefaulted = {
                        campaigns: [],
                        ...userDatum.data()
                    };
                    usersData[userDatum.id] = userDatumDefaulted;
                    // usersData.push({
                    //     displayName: userDatumDefaulted.displayName,
                    //     campaigns: userDatumDefaulted.campaigns,
                    //     uid: userDatum.id
                    // });
                });
                // setUsersObj(usersData.filter(userData => userData.uid !== userInfo.uid));
                setUsersObj(usersData);
            });
    
        // return () => {
        //     campaignStream.current();
        //     usersStream.current();
        // };
    }, [db, userInfo]);

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
            owner: userInfo.uid,
            name: newInputs.newCampaignName,
            members: [userInfo.uid]
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
    useEffect(() => {
        setSelectVals(campaigns.map(() => null));
    }, [campaigns])
    const handleSelectChangeById = (ev) => {
        // console.log(ev.target.id.split("_")[1]);
        // console.log(ev.target.value);
        const newArr = selectVals.slice();
        newArr[ev.target.id.split("_")[1]] = ev.target.value;
        setSelectVals(newArr);
    }
    const addNewPlayer = (ev) => {
        const idsArr = ev.target.id.split("_");
        const selectVal = selectVals[idsArr[1]];
        // console.log(selectVal);
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
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    }

    return(
        <section className="manage-campaigns">
            <h2>Your Campaigns</h2>
            {campaigns.map((campaignData, i) => (
                <section key={campaignData.id} className="one-campaign">
                    <h3>{campaignData.name}</h3>
                    <div>
                        <select id={`addusers_${i}`} onChange={handleSelectChangeById}>
                            <option value="Select User">Select User</option>
                            {otherUsersList(campaignData.members).map(userObj => {
                                return <option key={userObj.uid} value={userObj.uid}>{userObj.displayName}</option>
                            })}
                        </select>
                        <MyButton fct={addNewPlayer} evData={`add-player-to-campaign_${i}_${campaignData.id}`}>Add Player</MyButton>
                    </div>
                    <ul>
                        {campaignData.members.map(memberId => (
                            <li key={`${i}-${memberId}`}>
                                {getDisplayNameFromId(memberId)}
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
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