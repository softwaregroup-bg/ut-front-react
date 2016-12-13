import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import Text from '../../components/Text';
import { cookieCheck, logout } from '../LoginForm/actions.js';
import { fetchTranslations } from './actions';
import { translate, money, df as dateFormat, numberFormat, checkPermission, setPermissions } from './helpers';

class Gate extends Component {
    constructor(props) {
        super(props);

        this.loadGate = this.loadGate.bind(this);
    }

    getChildContext() {
        return {
            translate: translate(this.props),
            dateFormat: dateFormat(this.props),
            numberFormat: numberFormat(this.props),
            checkPermission,
            money
        }
    }

    componentWillMount() {
        let { cookieCheck } = this.props;

        cookieCheck();
    }

    componentWillReceiveProps(nextProps) {
        let { login, fetchTranslations, cookieCheck, logout } =  this.props;

        // TODO: handle the other cases
        if(!login.get('result') && nextProps.login.get('result') && nextProps.login.get('authenticated')) {
            this.loadGate(nextProps.login.getIn(['result', 'permission.get']).toJS(), nextProps.login.getIn(['result', 'language', 'languageId']))
        } else if(!nextProps.login.get('result') && login.get('authenticated') && !nextProps.login.get('authenticated')) {
            this.context.router.push('/login');
        }
        // TODO: test forceLogOut
        if(!login.get('forceLogOut') && nextProps.login.get('forceLogOut')) {
            logout();
        }
    }

    loadGate(permissions, languageId) {
        let { fetchTranslations } = this.props;

        setPermissions(permissions);

        fetchTranslations({
            languageId,
            itemTypeName: 'text',
            keyValue: true,
            isEnabled: true,
            pageSize: 10000
        });
    }

    render() {
        return (
            <div>
                { this.props.gate.get('loaded') ? this.props.children : <Text>Please wait...</Text> }
            </div>
        );
    }
}

export default connect(
    ({ login, gate }) => {
        return {
            login,
            gate
        }
    },
    { cookieCheck, fetchTranslations, logout }
)(Gate);

Gate.propTypes = {
    login: PropTypes.object,
    gate: PropTypes.object,
    cookieCheck: PropTypes.func,
    fetchTranslations: PropTypes.func,
    logout: PropTypes.func
};

Gate.defaultProps = {
    gate: Map(),
    login: Map()
};

Gate.contextTypes = {
    router: PropTypes.object
};

Gate.childContextTypes = {
    translate: PropTypes.func,
    money: PropTypes.func,
    dateFormat: PropTypes.func,
    numberFormat: PropTypes.func,
    checkPermission: PropTypes.func
};
