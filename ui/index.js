import React, {PropTypes} from 'react';
import { Router, Route, Switch } from 'react-router';
import { createHashHistory, createMemoryHistory } from 'history';
import {renderToString} from 'react-dom/server';
import ReactDOM from 'react-dom';
import Portal from './Portal';
import Dashboard from './Dashboard';
import wrapper from './wrapper';
import MaterialUILayout from '../components/MaterialUILayout';
import favicon from '../assets/images/favicon.ico';
import {LOGOUT} from '../containers/LoginForm/actionTypes';
import {Master} from '../pages';
import Gate from '../containers/Gate';
import LoginPage from '../components/LoginPage';
import SsoPage from '../components/SsoPage';
import {getRoute} from '../routerHelper';
import UTFrontReactReducers from './reducers';
import { Provider } from 'react-redux';
import { Store } from './Store';
import UtFrontMiddleware from './middleware';
// import { syncHistoryWithStore } from 'react-router-redux';
import PageNotFound from './components/PageNotFound.jsx';

export default function ui({utMethod, config = {}}) {
    async function render() {
        const routes = await this.fireEvent('route', {}, 'asyncMap');
        const menus = await this.fireEvent('menu', {}, 'asyncMap');
        const Wrapper = wrapper({menus});
        const App = await utMethod('mainUI.provider')({});
        const ConfigProvider = await utMethod('mainUI.configProvider')({});
        const MasterComponent = ({location}) => <Master>
            <ConfigProvider>
                <Portal location={location}>
                    {routes}
                    <Route exact path={getRoute('ut-impl:dashboard')} component={Dashboard} />
                </Portal>
            </ConfigProvider>
        </Master>;
        MasterComponent.propTypes = {
            location: PropTypes.object.isRequired
        };
        const GateComponent = props => <Gate {...props}>
            <Switch>
                <Route path='/sso/:appId/:ssoOrigin' component={SsoPage} />
                <Route component={MasterComponent} />
            </Switch>
        </Gate>;
        const container = <Provider store={this.store}>
            <App>
                <Wrapper>
                    <MaterialUILayout>
                        <Router history={this.history}>
                            <Switch>
                                <Route path='/login' component={LoginPage} />
                                <Route path='/sso/:appId/:ssoOrigin/login' component={LoginPage} />
                                <Route component={GateComponent} />
                                <Route path='*' component={PageNotFound} />
                            </Switch>
                        </Router>
                    </MaterialUILayout>
                </Wrapper>
            </App>
        </Provider>;
        if (typeof document !== 'undefined') {
            ReactDOM.render(container, document.getElementById('utApp'));
        } else {
            console.log(renderToString(container)); // eslint-disable-line
        }
    }

    return {
        init() {
            if (typeof document === 'undefined') return;
            var headHTML = document.getElementsByTagName('head')[0].innerHTML +
                '<link type="text/css" rel="stylesheet" href="/s/user/react/index.css">' +
                `<link href="${favicon}" rel="icon" type="image/x-icon" />`;
            document.getElementsByTagName('head')[0].innerHTML = headHTML;
            document.title = 'Standard';

            // initMirrors();
        },
        async start() {
            const reducers = await this.fireEvent('reducer', {}, 'asyncMap');
            this.history = (typeof window !== 'undefined') ? createHashHistory() : createMemoryHistory();
            this.store = Store(
                Object.assign({}, UTFrontReactReducers, ...reducers),
                LOGOUT,
                UtFrontMiddleware(utMethod, this.history)
            );
            // this.history = syncHistoryWithStore(useRouterHistory((typeof window !== 'undefined') ? createHashHistory : createMemoryHistory)(), this.store);
        },
        async ready() {
            await render.call(this);
        }
    };
};
