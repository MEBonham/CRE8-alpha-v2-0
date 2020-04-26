import React, { useContext } from 'react';

import { Store } from '../GlobalWrapper';
// import useLsPersistedState from '../../hooks/useLsPersistedState';
// import fb from '../../fbConfig';
import CharSheetTabs from './CharSheetTabs';
import Play from './Play';
import Configure from './Configure';
import Bio from './Bio';
import BuildLibrary from './BuildLibrary';

const CharSheetMain = () => {
    const [state] = useContext(Store);

    // const [activeTabs] = useLsPersistedState(LS_KEY, {});

    // const [tab, setTab] = useState(null);
    // useEffect(() => {
    //     if (state.cur) {
    //         setTab(activeTabs[state.cur.id]);
    //     }
    // }, [activeTabs, state.cur])

    // const [tab, setTab] = useState(state.editPrivilege ? "configure" : "play");
    // const [tab, setTab] = useState(null);

    // Once per load of character, sync the activeTabs state object with the database
    // const slugRef = useRef(null);
    // const loadActiveTabs = useCallback(async () => {
    //     try {
    //         let doc = await fb.db.collection("activeTabs").doc(state.user.uid).get();
    //         const docData = doc.exists ? doc.data() : {};
    //         const prevTabs = state.activeTabs ? { ...state.activeTabs } : {};
    //         return {
    //             ...prevTabs,
    //             ...docData
    //         };
    //     } catch(err) {
    //         console.log("Error loading activeTabs from db:", err);
    //     }
    // }, [state.activeTabs, state.user])
    // useEffect(() => {
    //     if (state.cur && state.user && state.cur.id !== slugRef.current) {
    //         slugRef.current = state.cur.id;
    //         loadActiveTabs().then((newVal) => {
    //             dispatch({ type: "SET", key: "activeTabs", payload: newVal });
    //         }).catch((err) => {
    //             console.log("Error:", err);
    //         })
    //     }
    // }, [dispatch, loadActiveTabs, state.cur, state.user])

    // Set tab to match global state record, or a default value
    // useEffect(() => {
    //     if (state.cur && state.activeTabs[state.cur.id]) {
    //         const activeTabsCopy = {
    //             [state.cur.id]: (state.editPrivilege ? "configure" :"play"),
    //             ...state.activeTabs
    //         };
    //         setTab(activeTabsCopy[state.cur.id]);
    //     }
    // }, [state.activeTabs, state.cur, state.editPrivilege])

    // Actually invoke the component that goes with the selected tab
    const tabContents = () => {
        if (state.cur) {
            switch (state.charSheetTab) {
                case "configure":
                    return <Configure />;
                case "bio":
                    return <Bio />;
                case "+library":
                    return <BuildLibrary />;
                default:
                    return <Play />;
            }
        } else {
            return null;
        }
    }
    
    return (
        <div className="parchment">
            <CharSheetTabs />
            <div className="parchment-padding">
                {tabContents()}
            </div>
        </div>
    );
}

export default CharSheetMain;