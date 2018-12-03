import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import Text from '../../components/Text';
import { cookieCheck, logout } from '../LoginForm/actions.js';
import { fetchTranslations } from './actions';
import { translate, money, df, numberFormat, checkPermission, setPermissions } from './helpers';

class Gate extends Component {
    constructor(props) {
        super(props);

        this.loadGate = this.loadGate.bind(this);
    }

    getChildContext() {
        return {
            translate: translate(this.props),
            dateFormat: df(this.props),
            numberFormat: numberFormat(this.props),
            checkPermission,
            money
        };
    }

    componentWillMount() {
        let { cookieCheck } = this.props;

        cookieCheck();
    }

    componentWillReceiveProps(nextProps) {
        let { cookieChecked, authenticated, result, forceLogOut, logout } = this.props;

        // if cookieCheck has passed and the user is authenticated, redirect to LoginPage
        // if the user is authenticated and there is a result from identity.check, load the gate (set permissions and fetch translations)
        // if the session expires, redirect to LoginPage
        if (!cookieChecked && nextProps.cookieChecked && !nextProps.authenticated) {
            this.context.router.push('/login');
        } else if (nextProps.authenticated && !result && nextProps.result) {
            this.loadGate(nextProps.result.get('permission.get').toJS(), nextProps.result.getIn(['language', 'languageId']));
        } else if (!nextProps.result && authenticated && !nextProps.authenticated) {
            this.context.router.push('/login');
        } else if (!forceLogOut && nextProps.forceLogOut) {
            logout();
        } else if (!nextProps.authenticated) {
            this.context.router.push('/login');
        }
    }

    loadGate(permissions, languageId) {
        let { fetchTranslations } = this.props;

        setPermissions(permissions);

        fetchTranslations({
            languageId,
            dictName: []
        });
    }

    render() {
        let { loaded } = this.props;

        return (
            <div>
                { loaded ? this.props.children : <Text>Please wait...</Text> }
            </div>
        );
    }
}

export default connect(
    ({ login, gate }) => ({
        cookieChecked: login.get('cookieChecked'),
        authenticated: login.get('authenticated'),
        result: login.get('result'),
        gate: gate,
        forceLogOut: gate.get('forceLogOut'),
        loaded: gate.get('loaded'),
        login: login
    }),
    { cookieCheck, fetchTranslations, logout }
)(Gate);

Gate.propTypes = {
    children: PropTypes.object,
    cookieChecked: PropTypes.bool,
    authenticated: PropTypes.bool,
    result: PropTypes.object,
    forceLogOut: PropTypes.bool,
    loaded: PropTypes.bool,
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
