import React, { PropTypes } from 'react';
import { Route } from 'react-router';
import { Gate, Master, Layout } from './pages';
import LoginForm from './containers/LoginForm';

const App = ({routes, extLayout, extMaster}) => {
    return (
        <Route>
            <Route path='/login' component={LoginForm} />
            <Route component={Gate}>
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
