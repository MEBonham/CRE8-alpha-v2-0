import React, { useState, useEffect, useRef, useContext } from 'react';
// import { v4 as uuidv4 } from 'uuid';
import { Store } from '../GlobalWrapper';
import fb from '../../fbConfig';
// import useForm from '../../hooks/useForm';

import MyButton from '../ui/MyButton';

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

    return (
        <section className="manage-campaigns rows">
            <h2>Your Campaigns</h2>
            {state.activeCampaigns && Object.keys(state.activeCampaigns).length ?
                Object.keys(state.activeCampaigns).map((campaignId, i) => {
                    const campaignInfo = state.activeCampaigns[campaignId];
                    return (
                        <section key={campaignId} className="rows">
                            <h3>{campaignInfo.name}</h3>
                            <form className="columns">
                                {/* <select onChange={handleSelectChangeById} id={`meb_addUserToCampaign_${i}`}> */}
                                <select id={`meb_selectUserForCampaign_${i}`}>
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
                }) : <p><em>(None)</em></p>}
        </section>
    );
}

export default ManageCampaigns;