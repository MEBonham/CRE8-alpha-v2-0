import React, { useState, useEffect, useRef, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
import useForm from '../../hooks/useForm';
import MyButton from '../ui/MyButton';
import MyFormButton from '../ui/MyFormButton';

const ManageCampaigns = () => {
    const [state, dispatch] = useContext(Store);
    const db = fb.db;

    const [usersData, setUsersData] = useState([]);
    const stream = useRef(null);
    useEffect(() => {
        stream.current = db.collection("users")
            // .onSnapshot(querySnapshot => {
            .get().then(querySnapshot => {
                const usersDataCopy = [];
                querySnapshot.forEach(doc => {
                    usersDataCopy.push({
                        id: doc.id,
                        displayName: doc.data().displayName
                    });
                });
                setUsersData(usersDataCopy);
            });
        // return () => {
        //     stream.current();
        // };
    }, [db]);

    const getDisplayNameFromId = (id) => {
        if (usersData) {
            return usersData.filter(userObj => userObj.id === id)
                .map(userObj => userObj.displayName);
        }
        return null;
    }
    const otherUsersList = (usersAlreadyIds) => {
        return usersData.filter(datum => !usersAlreadyIds.includes(datum.id));
    }

    useEffect(() => {
        const els = document.querySelectorAll("section.manage-campaigns section.one-campaign");
        els.forEach((el) => {
            const campaignId = el.querySelector(".campaign-id-stored").value;
            if (state.user && state.activeCampaigns[campaignId].owner === state.user.uid) {
                el.querySelector("select").disabled = false;
            }
        });
    }, [state.activeCampaigns, state.user])

    const addNewPlayer = async (ev) => {
        const campaignNum = ev.target.id.split("_")[2];
        const campaignId = ev.target.id.split("_")[3];
        const userId = document.getElementById(`meb_selectUserForCampaign_${campaignNum}`).value;
        if (userId !== "Select User") {
            try {
                const doc = await db.collection("campaigns").doc(campaignId).get();
                const prevMembers = doc.data().members;
                try {
                    await db.collection("campaigns").doc(campaignId).set({
                        members: [
                            ...prevMembers,
                            userId
                        ]
                    }, { merge: true });
                    console.log(state.activeCampaigns, campaignId);
                    dispatch({ type: "SET", key: "activeCampaigns", payload: {
                        ...state.activeCampaigns,
                        [campaignId]: {
                            ...state.activeCampaigns[campaignId],
                            members: [
                                ...prevMembers,
                                userId
                            ]
                        }
                    } });
                } catch(err) {
                    console.log("Error:", err);
                }
            } catch(err) {
                console.log("Error:", err);
            }
        }
    }

    const saveNewCampaign = async (ev) => {
        const id = uuidv4();
        try {
            await db.collection("campaigns").doc(id).set({
                owner: state.user.uid,
                name: inputs.newCampaignName,
                members: [state.user.uid]
            });
            dispatch({ type: "SET", key: "activeCampaigns", payload: {
                ...state.activeCampaigns,
                [id]: {
                    owner: state.user.uid,
                    name: inputs.newCampaignName,
                    members: [state.user.uid]
                }
            } });
            setInputs({
                ...inputs,
                newCampaignName: ""
            });
        } catch (err) {
            console.log("Error:", err);
        }
    }
    const { inputs, handleInputChange, handleSubmit, setInputs } = useForm(saveNewCampaign);

    return (
        <section className="manage-campaigns rows">
            <h2>Your Campaigns</h2>
            {state.activeCampaigns && Object.keys(state.activeCampaigns).length ?
                Object.keys(state.activeCampaigns).map((campaignId, i) => {
                    const campaignInfo = state.activeCampaigns[campaignId];
                    return (
                        <section key={campaignId} className="one-campaign rows">
                            <h3>{campaignInfo.name}</h3>
                            <form className="columns">
                                {/* <select onChange={handleSelectChangeById} id={`meb_addUserToCampaign_${i}`}> */}
                                <input type="hidden" value={campaignId} className="campaign-id-stored" />
                                <select id={`meb_selectUserForCampaign_${i}`} disabled>
                                    <option value="Select User">Select User</option>
                                    {otherUsersList(campaignInfo.members).map((userObj) => (
                                        <option value={userObj.id} key={userObj.id}>{userObj.displayName}</option>
                                    ))}
                                </select>
                                <MyButton fct={addNewPlayer} evData={`meb_addUserToCampaign_${i}_${campaignId}`}>Add Player</MyButton>
                            </form>
                            <ul className="columns">
                                {campaignInfo.members.map(memberId => (
                                    <li key={`${i}_${memberId}`}>
                                        {getDisplayNameFromId(memberId)}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    );
                }) :
            <p><em>(None)</em></p>}
            {state.user ? 
                <section className="new-campaign">
                    <h3>Create New Campaign</h3>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="newCampaignName">Name</label>
                            <input
                                type="text"
                                id="newCampaignName"
                                onChange={handleInputChange}
                                value={inputs.newCampaignName || ""}
                                required
                            />
                        </div>
                        <MyFormButton type="submit">Save</MyFormButton>
                    </form>
                </section> :
            null}
        </section>
    );
}

export default ManageCampaigns;