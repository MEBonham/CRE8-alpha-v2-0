import React, { useEffect, useContext } from 'react';
import { Redirect, Route, Switch, useParams, useRouteMatch } from 'react-router-dom';

import { Store } from '../GlobalWrapper';
import MyLink from '../ui/MyLink';
import KitsLibraryMenu from './KitsLibraryMenu';
import FeatsLibraryMenu from './FeatsLibraryMenu';
import TalentsLibraryMenu from './TalentsLibraryMenu';
import ItemsLibraryMenu from './ItemsLibraryMenu';
import WeaponsTable from './WeaponsTable';

const LibraryMenu = (props) => {
    const [, dispatch] = useContext(Store);
    // Close menu that presumably led you here
    useEffect(() => {
        dispatch({ type: "SET", key: "mainNavMenuOpen", payload: false });
    }, [dispatch])

    const match = useRouteMatch();
    let branch = null;
    const { category } = useParams();
    useEffect(() => {
        localStorage.setItem("libraryCategoryViewed", category);
    }, [category])
    if (category) {
        branch = category;
    } else {
        branch = localStorage.getItem("libraryCategoryViewed") || props.category || "kits";
        return <Redirect to={`${match.url}/${branch}`} />;
    }

    return (
        <div className="library primary-content content-padding">
            <h1>Character Options Library</h1>
            <div className="columns">
                <MyLink to={`/library/kits`} className={category === "kits" ? "on" : "off"}>Kits</MyLink>
                <MyLink to={`/library/feats`} className={category === "feats" ? "on" : "off"}>Feats</MyLink>
                <MyLink to={`/library/talents`} className={category === "talents" ? "on" : "off"}>Talents</MyLink>
                <MyLink to={`/library/items`} className={category === "items" ? "on" : "off"}>Items</MyLink>
            </div>
            <Switch>
                <Route exact path={`/library/kits`} component={KitsLibraryMenu} />
                <Route exact path={`/library/feats`} component={FeatsLibraryMenu} />
                <Route exact path={`/library/talents`} component={TalentsLibraryMenu} />
                <Route exact path={`/library/weapons`} component={WeaponsTable} />
                <Route exact path={`/library/items`} component={ItemsLibraryMenu} />
            </Switch>
        </div>
    );
}

export default LibraryMenu;