import immutable from 'immutable';
import { connect } from 'react-redux';
import { getLoginStaticStorage } from './loginStaticStorage';
import { actionIsForLogin, loginFormPaths, loginDataPaths } from './helpers';

export const loginStoreConnectProxy = (mapStateToProps, mapDispatchToProps) => {
    const proxyMapStateToProps = state => {
        const staticStorage = getLoginStaticStorage();
        if (state && state.login) {
            let newLogin = immutable.fromJS(state.login.toJS());
            loginFormPaths.forEach(path => {
                if (staticStorage.getIn(path) && newLogin.hasIn(path.slice(0,-1))) {
                    newLogin = newLogin.setIn(path, staticStorage.getIn(path));
                }
            });
            loginDataPaths.forEach(path => {
                if (staticStorage.getIn(path)) {
                    newLogin = newLogin.setIn(path, staticStorage.getIn(path));
                }
            });
            return mapStateToProps({ login: newLogin });
        }
        return state;
    };
    const connectResult = connect(proxyMapStateToProps, mapDispatchToProps);
    return connectResult;
};