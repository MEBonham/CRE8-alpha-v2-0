import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Switch, Route } from 'react-router-dom';
import fb from '../fbConfig';
import useGlobal from '../hooks/useGlobal';

import Header from './header/Header';
import Footer from './footer/Footer';
import Guarded from './Guarded';
import Home from './other/Home';
import NewCharForm from './newchar/NewCharForm';
import CharSheetMain from './charsheet/CharSheetMain';
import CharMenu from './other/CharMenu';
import RollsDisplay from './game/RollsDisplay';
import ForgotPassword from './auth/ForgotPassword';
import Login from './auth/Login';
import Register from './auth/Register';
import Private from './auth/Private';
import Settings from './other/Settings';

import '../css/App.css';

const App = () => {
    // const appReducer = (state, action) => {
    //     switch (action.type) {
    //         case 'ADJUST_HEIGHTS':
    //             return {
    //                 ...state,
    //                 styleObj: { 
    //                     height: `${document.querySelector("body").offsetHeight
    //                          - document.querySelector(".main-page-header").offsetHeight - 21}px`
    //                 }
    //             };
    //         case 'ERROR':
    //             return { ...state, errorMessage: action.error };
    //         // case 'UPDATE_CAMPAIGNS':
    //         //     setUsersCampaigns(action.payload);
    //         //     return state;
    //         default:
    //             return state;
    //     }
    // }

    // const useApp = () => {
    //     const db = fb.db;
    //     const [userInfo, setUserInfo] = useGlobal("user");
    //     const [, setUsersCampaigns] = useGlobal("usersCampaigns");
    //     const initialState = {
    //         userInfo,
    //         setUsersCampaigns,
    //         styleObj: {},
    //         errorMessage: ""
    //     };
    //     const [state, dispatch] = useReducer(appReducer, initialState);

    //     // const updateUser = async (user) => {
    //     //     try {
    //     //         setUserInfo(user);
    //     //     } catch (err) {
    //     //         dispatch({ type: 'ERROR', error: err.message || err });
    //     //     }
    //     // }

    //     const fetchCampaigns = () => {
    //         let campaignStream = db.collection("campaigns")
    //             //.onSnapshot(querySnapshot => {
    //             .get().then(querySnapshot => {
    //                 const campaignInfo = {};
    //                 querySnapshot.forEach(campaign => {
    //                     if (campaign.data().members.includes(userInfo.uid)) {
    //                         campaignInfo[campaign.id] = campaign.data();
    //                     }
    //                 });
    //                 setUsersCampaigns(campaignInfo);
    //                 // dispatch({ type: "UPDATE_CAMPAIGNS", payload: campaignInfo });
    //                 return campaignStream;
    //             })
    //             .catch(err => {
    //                 dispatch({ type: 'ERROR', error: err.message || err });
    //                 return null;
    //             });
    //     }

    //     useEffect(() => {
    //         fb.auth.onAuthStateChanged(user => {
    //             setUserInfo(user);
    //         });
    //         dispatch({ type: 'ADJUST_HEIGHTS' })
    //     }, [setUserInfo])

    //     useEffect(() => {
    //         if (userInfo) {
    //             const unsubscribeObj = fetchCampaigns();
    //             return () => unsubscribeObj;
    //         }
    //     }, [fetchCampaigns, userInfo])

    //     return state;
    // }

    // console.log(useApp());
    // const { styleObj } = useApp();

    const [userInfo, setUserInfo] = useGlobal("user");
    const [firstLoad, setFirstLoad] = useState(true);
    const [bodyHeight, setBodyHeight] = useState(900);
    const [headerHeight, setHeaderHeight] = useState(200);
    const styleObj = {height: (bodyHeight - headerHeight - 21) + "px"};
    useEffect(() => {
        if (firstLoad) {
            fb.auth.onAuthStateChanged(user => {
                setUserInfo(user);
            });
            setBodyHeight(document.querySelector("body").offsetHeight);
            setHeaderHeight(document.querySelector(".main-page-header").offsetHeight);
            setFirstLoad(false);
        }
    }, [firstLoad, setUserInfo]);

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
                    // dispatch({ type: "UPDATE_CAMPAIGNS" });
                });
        
            // return () => {
            //     campaignStream.current();
            // };
        }
    }, [db, setUsersCampaigns, userInfo])

    const { pathname } = useLocation();
    const scrollContainer = useRef(null);
    useEffect(() => {
        scrollContainer.current.scroll(0, 0);
    }, [pathname]);

    return (
        <div className="App">
            <Header />
            <div className="main-envelope" style={styleObj}>
                <div className="main-contents" ref={scrollContainer}>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path={["/index", "/index.html"]} component={Home} />
                        <Guarded path="/characters/new"><NewCharForm /></Guarded>
                        <Route path="/characters/:slug" component={CharSheetMain} />
                        <Route path="/characters" component={CharMenu} />
                        <Route path="/login/forgot" component={ForgotPassword} />
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <Guarded path="/private"><Private /></Guarded>
                        <Guarded path="/user/settings"><Settings /></Guarded>
                    </Switch>
                </div>
                <div className="main-sidebar">
                    <RollsDisplay />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default App;