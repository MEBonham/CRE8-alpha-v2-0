import { useEffect, useRef } from 'react';
import fb from '../fbConfig';
import useGlobal from '../hooks/useGlobal';

const StateHolder = () => {
    const [userInfo, setUserInfo] = useGlobal("user");
    const firstLoad = useRef(true);
    useEffect(() => {
        if (firstLoad.current) {
            fb.auth.onAuthStateChanged(user => {
                setUserInfo(user);
            });
            firstLoad.current = false;
        }
    }, [setUserInfo])

    const db = fb.db;
    const campaignStream = useRef(null);
    const [, setUsersCampaigns] = useGlobal("usersCampaigns");
    useEffect(() => {
        if (userInfo) {
            campaignStream.current = db.collection("campaigns")
                //.onSnapshot(querySnapshot => {
                .get().then(querySnapshot => {
                    const campaignInfo = {};
                    querySnapshot.forEach(campaign => {
                        if (campaign.data().members.includes(userInfo.uid)) {
                            campaignInfo[campaign.id] = campaign.data();
                        }
                    });
                    setUsersCampaigns(campaignInfo);
                });
        
            // return () => {
            //     campaignStream.current();
            // };
        } else {
            setUsersCampaigns({
                standard: {},
                public: {}
            })
        }
    }, [db, setUsersCampaigns, userInfo])

    // const [displayArr] = useGlobal("rollsDisplayArray");            // To preserve when RollsDisplay gets re-mounted

    return (null);
}

export default StateHolder;