import PropTypes from 'prop-types';
import React from 'react';
import { Route } from 'react-router';
import { Master, Layout } from './pages';
import Gate from './containers/Gate';
import LoginPage from './components/LoginPage';
import SsoPage from './components/SsoPage';

const App = ({routes, masterRoutes, extLayout, extMaster}) => {
    return (
        <Route>
            <Route path='/login' component={LoginPage} />
            <Route path='/sso/:appId/:ssoOrigin/login' component={LoginPage} />
            <Route component={Gate}>
                <Route path='/sso/:appId/:ssoOrigin' component={SsoPage} />
                <Route component={extMaster || Master}>
                    <Route component={extLayout || Layout}>
                        {routes}
                    </Route>
                    {masterRoutes}
                </Route>
            </Route>
        </Route>
    );
};

App.propTypes = {
    masterRoutes: PropTypes.node,
    routes: PropTypes.node,
    extLayout: PropTypes.node,
    extMaster: PropTypes.node,
    images: PropTypes.object
};

export default App;
