import React, { useState, useEffect, useRef } from 'react';
import fb from '../../fbConfig';

import MyExternalLink from '../ui/MyExternalLink';
import MyLink from '../ui/MyLink';
import RankButtonSystem from './RankButtonSystem';

const AdminSettings = ({ ownId }) => {
    const GOOGLE_LINK = "https://console.firebase.google.com/project/cre8-alpha/authentication/users";
    const db = fb.db;

    const [openArr, setOpenArr] = useState();

    const [usersInfo, setUsersInfo] = useState([]);
    const stream = useRef(null);
    useEffect(() => {
        stream.current = db.collection("users")
            // .onSnapshot(querySnapshot => {
            .get().then(querySnapshot => {
                const userData = [];
                querySnapshot.forEach(doc => {
                    userData.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                setUsersInfo(userData);
            });
        // return () => {
        //     stream.current();
        // };
    }, [db]);

    useEffect(() => {
        const openArrCopy = [];
        usersInfo.forEach(() => {
            openArrCopy.push(false);
        });
        setOpenArr(openArrCopy);
    }, [usersInfo])

    const togglePopout = (ev) => {
        const whichRow = parseInt(ev.target.id.split("_")[2]);
        const openClosedArray = openArr.slice();
        openClosedArray.forEach((boolean, i) => {
            if (i === whichRow) {
                openClosedArray[i] = !openArr[i];
            } else {
                openClosedArray[i] = false;
            }
        });
        setOpenArr(openClosedArray);
    }

    const closePopoutByRow = (rowNum) => {
        const openClosedArray = openArr.slice();
        openClosedArray[rowNum] = false;
        setOpenArr(openClosedArray);
    }
    const setRank = (ev) => {
        const idDerivedArr = ev.target.id.split("_");
        db.collection("users").doc(idDerivedArr[2]).set({
            rank: idDerivedArr[3]
        }, { merge: true })
            .then(() => {
                closePopoutByRow(idDerivedArr[4]);
                const togButton = document.getElementById(`meb_openRanksButton_${idDerivedArr[4]}`);
                togButton.innerText = idDerivedArr[3];
            })
            .catch((err) => {
                console.log("Error:", err);
            });
    }

    return (
        <section className="admin-settings">
            <h2>Administration</h2>
            <div className="buttons-bank columns">
                <MyLink to="/obscureaddress">Batch-edit database entities</MyLink>
                <MyLink to="/library/edit/kits">Edit Kits</MyLink>
                <MyLink to="/library/edit/feats">Edit Feats</MyLink>
                <MyLink to="/library/edit/talents">Edit Talents</MyLink>
            </div>
            <section className="user-management">
                <h3>Manage Users</h3>
                <table className="user-management-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Rank</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersInfo.map((userInfo, i) => (
                            <tr key={userInfo.id}>
                                <td><span>{userInfo.displayName}</span></td>
                                <td>
                                    {userInfo.id === ownId ? null :
                                        <RankButtonSystem 
                                            index={i}
                                            datum={userInfo}
                                            toggle={togglePopout}
                                            classes={openArr[i] ? "popout open" : "popout closed"}
                                            setRank={setRank}
                                        />}
                                </td>
                                <td>
                                    <span>
                                        {<a href={`mailto:${userInfo.email}`}>{userInfo.email}</a>}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <MyExternalLink href={GOOGLE_LINK} target="_blank" rel="noopener noreferrer">More control over users</MyExternalLink>
            </section>
        </section>
    );
}

export default AdminSettings;