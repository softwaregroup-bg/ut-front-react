import React from 'react';
import {Route} from 'react-router';
import {renderToString} from 'react-dom/server';
import ReactDOM from 'react-dom';
import {hot} from 'react-hot-loader/root';
import {UtFront} from './app';
import Portal from './Portal';
import Dashboard from './Dashboard';
import MaterialUILayout from '../components/MaterialUILayout';
import favicon from '../assets/images/favicon.ico';
import {LOGOUT} from '../containers/LoginForm/actionTypes';
import {Master} from '../pages';
import Gate from '../containers/Gate';
import LoginPage from '../components/LoginPage';
import SsoPage from '../components/SsoPage';
import {getRoute} from '../routerHelper';
import UTFrontReactReducers from './reducers';

export default function ui({utMethod, config = {}}) {
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
        async ready() {
            let routes = await this.fireEvent('route', {}, 'asyncMap');
            let reducers = await this.fireEvent('reducer', {}, 'asyncMap');
            let Provider = await utMethod('mainUI.provider')({});
            let ConfigProvider = await utMethod('mainUI.configProvider')({});
            let container = hot(
                <Provider>
                    <MaterialUILayout>
                        <UtFront
                            reducers={Object.assign({}, UTFrontReactReducers, ...reducers)}
                            utMethod={utMethod}
                            resetAction={LOGOUT}>
                            <Route>
                                <Route path='/login' component={LoginPage} />
                                <Route path='/sso/:appId/:ssoOrigin/login' component={LoginPage} />
                                <Route component={Gate}>
                                    <Route path='/sso/:appId/:ssoOrigin' component={SsoPage} />
                                    <Route component={Master}>
                                        <Route component={Portal}>
                                            <Route component={ConfigProvider}>
                                                {routes}
                                                <Route path={getRoute('ut-impl:dashboard')} component={Dashboard} />
                                            </Route>
                                        </Route>
                                    </Route>
                                </Route>
                            </Route>
                        </UtFront>
                    </MaterialUILayout>
                </Provider>
            );
            if (typeof document !== 'undefined') {
                ReactDOM.render(container, document.getElementById('utApp'));
            } else {
                console.log(renderToString(container)); // eslint-disable-line
            }
        }
    };
};
