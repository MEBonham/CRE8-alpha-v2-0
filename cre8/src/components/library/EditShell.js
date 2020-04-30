import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import BuildLibraryKits from '../charsheet/BuildLibraryKits';
import KitEditingMenu from '../library/KitEditingMenu';

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
            </Switch>
        </div>
    );
}

export default EditShell;