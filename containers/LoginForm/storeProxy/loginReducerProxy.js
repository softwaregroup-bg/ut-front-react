import { getLoginStaticStorage, setLoginStaticStorage, resetLoginStaticStorage } from './loginStaticStorage';
import { actionIsForLogin, loginFormPaths, loginDataPaths } from './helpers';
import { LOGIN, LOGOUT, CLEAR_LOGIN_STATE } from '../actionTypes';

// Before login reducer

export const prePopulate = (state, action) => {
    // if (!actionIsForLogin(action.type)) {
    //     return state;
    // }
    const loginStaticStorage = getLoginStaticStorage();

    // pre-populates loginForm state
    loginFormPaths.forEach(path => {
        if (state && loginStaticStorage.getIn(path) && state.hasIn(path.slice(0, -1))) {
            state = state.setIn(path, loginStaticStorage.getIn(path));
        }
    });

    // pre-populates loginData state
    loginDataPaths.forEach(path => {
        if (state && loginStaticStorage.getIn(path) && state.hasIn(path)) {
            state = state.setIn(path, loginStaticStorage.getIn(path));
        }
    });

    return state;
};

// After login reducer

export const loginReducerProxy = (state, action) => {
    if (!actionIsForLogin(action.type)) {
        return state;
    }
    if (action.type === LOGOUT ||
        action.type === CLEAR_LOGIN_STATE ||
        (action.type === LOGIN && state && state.get('authenticated') && state.get('cookieChecked'))) {
        resetLoginStaticStorage();
    }
    let loginStaticStorage = getLoginStaticStorage();

    loginFormPaths.forEach(path => {
        if (state.hasIn(path)) {
            loginStaticStorage = loginStaticStorage.setIn(path, state.getIn(path));
        }
        state = state.deleteIn(path);
    });
    loginDataPaths.forEach(path => {
        if (state.hasIn(path)) {
            loginStaticStorage = loginStaticStorage.setIn(path, state.getIn(path));
        }
        state = state.deleteIn(path);
    });

    setLoginStaticStorage(loginStaticStorage);

    return state;
};
