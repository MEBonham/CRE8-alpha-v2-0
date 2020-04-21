import React, { useContext } from 'react';
import { Context } from '../GlobalWrapper';

const CharSheetTabs = () => {
    const [{ cur }, dispatch] = useContext(Context);
    const classInactive = "char-sheet-tab";
    const classActive = "char-sheet-tab active";

    // const [cur, setCur] = useGlobal("cur");
    // const [tab, setTab] = useState(null);
    // useEffect(() => {
    //     dispatch({ type: "SET", key: "cur", payload: cur.activeTab });
    // }, [cur])

    const tabClick = (ev) => {
        const setStr = ev.target.id.split("_")[1];
        dispatch({ type: "SET", key: "cur", payload: {
            ...cur,
            activeTab: setStr
        } });
    }

    return(
        <div className="char-sheet-tabs">
            <span onClick={tabClick} id="main-tab_play" className={cur.activeTab === "play" ? classActive : classInactive}>Play</span>
            <span onClick={tabClick} id="main-tab_configure" className={cur.activeTab === "configure" ? classActive : classInactive}>Configure</span>
            <span onClick={tabClick} id="main-tab_bio" className={cur.activeTab === "bio" ? classActive : classInactive}>Bio</span>
            <span onClick={tabClick} id="main-tab_+library" className={cur.activeTab === "+library" ? classActive : classInactive}>+Library</span>
        </div>
    );
}

export default CharSheetTabs;