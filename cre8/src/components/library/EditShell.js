import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import BuildLibraryKits from '../charsheet/BuildLibraryKits';
import KitEditingMenu from '../library/KitEditingMenu';
import BuildLibraryFeats from '../charsheet/BuildLibraryFeats';
import FeatEditingMenu from '../library/FeatEditingMenu';
import BuildLibraryTalents from '../charsheet/BuildLibraryTalents';
import TalentEditingMenu from '../library/TalentEditingMenu';
import BuildLibraryItems from '../charsheet/BuildLibraryItems';
import ItemsEditingMenu from '../library/ItemsEditingMenu';

const EditShell = () => {
    const match = useRouteMatch();
    return (
        <div className="primary-content content-padding">
            <Switch>
                <Route exact path={`${match.url}/kits`} component={KitEditingMenu} />
                <Route
                    path={`${match.url}/kits/:slug`}
                    render={() => <BuildLibraryKits editing />}
                />
                <Route exact path={`${match.url}/feats`} component={FeatEditingMenu} />
                <Route
                    path={`${match.url}/feats/:slug`}
                    render={() => <BuildLibraryFeats editing />}
                />
                <Route exact path={`${match.url}/talents`} component={TalentEditingMenu} />
                <Route
                    path={`${match.url}/talents/:slug`}
                    render={() => <BuildLibraryTalents editing />}
                />
                <Route exact path={`${match.url}/items`} component={ItemsEditingMenu} />
                <Route
                    path={`${match.url}/items/:slug`}
                    render={() => <BuildLibraryItems editing />}
                />
            </Switch>
        </div>
    );
}

export default EditShell;