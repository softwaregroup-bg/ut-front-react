import immutable from 'immutable';
import { connect } from 'react-redux';
import { getLoginStaticStorage } from './loginStaticStorage';
import { paths } from './helpers';

export const loginStoreConnectProxy = (mapStateToProps, mapDispatchToProps) => {
    const proxyMapStateToProps = state => {
        const staticStorage = getLoginStaticStorage();
        if (state && state.login) {
            let newLogin = immutable.fromJS(state.login.toJS());
            paths.forEach(path => {
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