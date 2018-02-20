import { login } from '../reducer';
import { getLoginStaticStorage, setLoginStaticStorage } from './loginStaticStorage';
import { paths } from './helpers';

export const prePopulate = (state, action) => {
    let loginStaticStorage = getLoginStaticStorage();
    paths.forEach(path => {
        if (state && state.hasIn && state.hasIn(path)) {
            state = state.setIn(path, loginStaticStorage.getIn(path));
        }
    })
    return state;
};

export const loginReducerProxy = (state, action) => {
    let loginStaticStorage = getLoginStaticStorage();
    console.group('login reducer proxy');
    console.log('action', action);
    console.log('state', state.toJS());
    paths.forEach(path => {
        if (state.hasIn(path)) {
            loginStaticStorage = loginStaticStorage.setIn(path, state.getIn(path));
        }
        state = state.deleteIn(path);
    })
    console.log('static', loginStaticStorage.toJS());
    console.groupEnd();
    setLoginStaticStorage(loginStaticStorage);
    return state;
};
