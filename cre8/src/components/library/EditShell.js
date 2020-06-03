import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import BuildLibraryKits from '../charsheet/BuildLibraryKits';
import KitEditingMenu from './KitEditingMenu';
import BuildLibraryFeats from '../charsheet/BuildLibraryFeats';
import FeatEditingMenu from './FeatEditingMenu';
import BuildLibraryTalents from '../charsheet/BuildLibraryTalents';
import TalentEditingMenu from './TalentEditingMenu';
import BuildLibraryItems from '../charsheet/BuildLibraryItems';
import ItemEditingMenu from './ItemEditingMenu';
import BuildLibraryRituals from '../charsheet/BuildLibraryRituals';
import RitualEditingMenu from './RitualEditingMenu';

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
                <Route exact path={`${match.url}/items`} component={ItemEditingMenu} />
                <Route
                    path={`${match.url}/items/:slug`}
                    render={() => <BuildLibraryItems editing />}
                />
                <Route exact path={`${match.url}/rituals`} component={RitualEditingMenu} />
                <Route
                    path={`${match.url}/rituals/:slug`}
                    render={() => <BuildLibraryRituals editing />}
                />
            </Switch>
        </div>
    );
}

export default EditShell;