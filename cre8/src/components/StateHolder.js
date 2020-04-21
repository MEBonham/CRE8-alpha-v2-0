// import { useEffect, useRef, useContext } from 'react';
// import fb from '../fbConfig';
// import { Context } from './GlobalWrapper';

// const StateHolder = () => {
//     const [state, dispatch] = useContext(Context);
//     const firstLoad = useRef(true);
//     useEffect(() => {
//         if (firstLoad.current) {
//             fb.auth.onAuthStateChanged(user => {
//                 dispatch({ type: "SET", key: "user", payload: user });
//             });
//             firstLoad.current = false;
//         }
//     }, [])

//     const db = fb.db;
//     const campaignStream = useRef(null);
//     useEffect(() => {
//         if (state.user) {
//             campaignStream.current = db.collection("campaigns")
//                 //.onSnapshot(querySnapshot => {
//                 .get().then(querySnapshot => {
//                     const campaignInfo = {};
//                     querySnapshot.forEach(campaign => {
//                         if (campaign.data().members.includes(userInfo.uid)) {
//                             campaignInfo[campaign.id] = campaign.data();
//                         }
//                     });
//                     setUsersCampaigns(campaignInfo);
//                 });
        
//             // return () => {
//             //     campaignStream.current();
//             // };
//         } else {
//             setUsersCampaigns({
//                 standard: {},
//                 public: {}
//             })
//         }
//     }, [db, setUsersCampaigns, userInfo])

//     const [displayArr] = useGlobal("rollsDisplayArray");            // To preserve when RollsDisplay gets re-mounted

//     return (null);
// }

// export default StateHolder;