import { login } from '../reducer';
import { getLoginStaticStorage, setLoginStaticStorage } from './loginStaticStorage';
import { paths } from './helpers';

export const prePopulate = (state, action) => {
    let loginStaticStorage = getLoginStaticStorage();
    paths.forEach(path => {
        if (state && loginStaticStorage.getIn(path) && state.hasIn(path.slice(0,-1))) {
            state = state.setIn(path, loginStaticStorage.getIn(path));
        }
    })
    return state;
};

export const loginReducerProxy = (state, action) => {
    let loginStaticStorage = getLoginStaticStorage();
    paths.forEach(path => {
        if (state.getIn(path)) {
            loginStaticStorage = loginStaticStorage.setIn(path, state.getIn(path));
        }
        state = state.deleteIn(path);
    })
    setLoginStaticStorage(loginStaticStorage);
    return state;
};
