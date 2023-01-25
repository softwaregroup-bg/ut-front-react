import thunk from 'redux-thunk';
import {isImmutable, fromJS} from 'immutable';
import {REMOVE_TAB} from '../containers/TabMenu/actionTypes';

/**
 * Convert action.params to plain js when action.params is immutable
 */
const cloneParams = (params) => {
    if (isImmutable(params)) {
        return params.toJS(); // no need to clone as toJS returns a new instance
    } else if (params instanceof Array) {
        return params.slice();
    } else {
        return Object.assign({}, params);
    }
};

const getCookies = () => (typeof document === 'undefined') ? {} : document.cookie.split(';').map((c) => (c.split('='))).reduce((a, c) => {
    const key = c.shift().trim();
    a[key] = c.shift();
    return a;
}, {});

export default (utMethod, history) => {
    const rpc = (store) => (next) => (action) => {
        if (action.method) {
            const cookies = getCookies();
            const corsCookie = cookies['xsrf-token'];
            let importMethodParams = {};
            const $meta = fromJS({$http: {mtid: ((action.mtid === 'notification' && 'notification') || 'request')}});
            let methodParams = fromJS(cloneParams(action.params))
                .mergeDeep($meta);

            if (action.$http) {
                methodParams = methodParams.mergeDeep(fromJS({$http: action.$http}));
            }

            if (action.requestTimeout) {
                importMethodParams = Object.assign({}, importMethodParams, {timeout: action.requestTimeout});
            }
            action.methodRequestState = 'requested';
            next(action);

            if (action.abort) {
                action.methodRequestState = 'finished';
                return next(action);
            }
            if (corsCookie) {
                methodParams = methodParams.mergeDeep(fromJS({$http: {headers: {'x-xsrf-token': corsCookie}}}));
            }
            
            const params = methodParams.toJS();
            if (Object.keys(params.formData || {}).length && !(params.formData instanceof window.FormData)) {
                const formData = new window.FormData();
                Object.keys(params.formData).forEach(key => {
                    formData.append(key, params.formData[key]);
                });
                params.formData = formData;
            }

            return utMethod(action.method, importMethodParams)(params)
                .then(result => {
                    action.result = result;
                    return result;
                })
                .catch(error => {
                    // Display a friendlier message on connection lost
                    if (error.type === 'PortHTTP.Generic' && error.message === 'Unexpected end of JSON input') {
                        error.message = 'Network connection lost';
                        error.print = 'Network connection lost';
                    }
                    action.error = error;
                    return error;
                })
                .then(() => {
                    action.methodRequestState = 'finished';
                    return next(action);
                });
        }
        return next(action);
    };

    const utBuslogger = (store) => (next) => (action) => {
        if (action.method) {
            // TODO: log the action
            return next(action);
        } else if (action.type === 'UT_LOG') {
            // TODO: log the action
            return action;
        }
        return next(action);
    };

    const closeTab = store => next => action => {
        if (action.type === REMOVE_TAB) {
            action.history = history;
        };
        return next(action);
    };

    return [thunk, closeTab, rpc, utBuslogger];
};
