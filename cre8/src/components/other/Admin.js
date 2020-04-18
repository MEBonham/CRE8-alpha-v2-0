import React, { useState, useEffect, useRef } from 'react';
import fb from '../../fbConfig';

const AdminSettings = () => {

    const db = fb.db;

    const ranksSystem = ["peasant", "archon", "admin"];
    const [openPopups, setOpenPopups] = useState([]);

    const [usersInfo, setUsersInfo] = useState([]);
    const stream = useRef(null);
    useEffect(() => {
        stream.current = db.collection("users")
            .onSnapshot(querySnapshot => {
                const userData = [];
                querySnapshot.forEach(doc => {
                    userData.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                setUsersInfo(userData);
            });
    
        return () => {
            stream.current();
        };
    }, [db]);

    useEffect(() => {
        const openClosedArray = [];
        usersInfo.forEach((datum, i) => {
            openClosedArray.push("popout closed");
        });
        setOpenPopups(openClosedArray);
    }, [usersInfo])

    const togglePopout = (ev) => {
        const arrAroundIndex = ev.target.id.split("-");
        const whichRow = parseInt(arrAroundIndex[1]);
        const openClosedArray = openPopups.slice();
        openClosedArray.forEach((entry, i) => {
            if (i === whichRow) {
                if (openClosedArray[i] === "popout closed") {
                    openClosedArray[i] = "popout open";
                } else {
                    openClosedArray[i] = "popout closed";
                }
            } else {
                openClosedArray[i] = "popout closed";
            }
        });
        setOpenPopups(openClosedArray);
    }

    const setRank = (ev) => {
        const arrAroundIndex = ev.target.id.split("-");
        db.collection("users").doc(arrAroundIndex[1]).set({
            rank: arrAroundIndex[2]
        }, { merge: true });
    }

    return(
        <section>
            <h2>Administration</h2>
            <section>
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
                        {usersInfo.map((datum, i) => {
                            return(
                                <tr key={datum.id}>
                                    <td><span>{datum.displayName}</span></td>
                                    <td>
                                        <div className="popout-system">
                                            <button onClick={togglePopout} id={`openRanks-${i}-button`}>{datum.rank}</button>
                                            <div className={openPopups[i]}>
                                                {ranksSystem.map(rankName => {
                                                    return(
                                                        <button 
                                                            key={rankName}
                                                            onClick={setRank}
                                                            id={`changeRank-${datum.id}-${rankName}`}
                                                        >{rankName}</button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </td>
                                    <td><span>{datum.email}</span></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </section>
        </section>
    );
}

export default AdminSettings;