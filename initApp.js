import React, { PropTypes } from 'react';
import { Route } from 'react-router';
import { Master, Layout } from './pages';
import Gate from './containers/Gate';
import LoginPage from './components/LoginPage';
import SsoPage from './components/SsoPage';

const App = ({routes, extLayout, extMaster}) => {
    return (
        <Route>
            <Route path='/login' component={LoginPage} />
            <Route path='/sso/:ssoOrigin/login' component={LoginPage} />
            <Route component={Gate}>
                <Route path='/sso/:ssoOrigin' component={SsoPage} />
                <Route component={extMaster || Master}>
                    <Route component={extLayout || Layout}>
                        {routes}
                    </Route>
                </Route>
            </Route>
        </Route>
    );
};

App.propTypes = {
    routes: PropTypes.node,
    extLayout: PropTypes.node,
    extMaster: PropTypes.node,
    images: PropTypes.object
};

export default App;
