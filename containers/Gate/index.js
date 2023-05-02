/** eslint-disable react/no-unused-prop-types */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import Loader from '../../components/Loader';
import { cookieCheck, setLoadGate, logout } from '../LoginForm/actions.js';
import { fetchTranslations } from './actions';
import { translate, money, df, numberFormat, checkPermission, setPermissions } from './helpers';
import style from './style.css';

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
        const { cookieChecked, isLogout, authenticated, cookieCheck, match } = this.props;

        if (!cookieChecked && !isLogout) {
            cookieCheck({appId: match && match.params && match.params.appId});
        } else if (authenticated) {
            // If user tries manually to go to /login page while he/she is logged in, redirects to
            this.context.router.history.push('/');
        } else {
            this.context.router.history.push('/login');
        }
    }

    componentWillReceiveProps(nextProps) {
        const { cookieChecked, authenticated, forceLogOut, logout, match } = this.props;

        // if cookieCheck has passed and the user is authenticated, redirect to LoginPage
        // if the user is authenticated and there is a result from identity.check, load the gate (set permissions and fetch translations)
        // if the session expires, redirect to LoginPage
        const isAuthenticated = !(!cookieChecked && nextProps.cookieChecked && !nextProps.authenticated);
        if (!isAuthenticated && this.context.router.route.location.pathname !== '/login') {
            if (match && match.params && match.params.ssoOrigin) {
                this.context.router.history.push(`/sso/${match.params.appId}/${match.params.ssoOrigin}/login`);
            } else {
                this.context.router.history.push('/login');
            }
        } else if (nextProps.authenticated && !nextProps.gateLoaded && nextProps.result) {
            this.loadGate(nextProps.result.get('permission.get').toJS(), nextProps.result.getIn(['language', 'languageId']));
        } else if (!nextProps.result && authenticated && !nextProps.authenticated) {
            this.context.router.history.push('/login');
        } else if (!forceLogOut && nextProps.forceLogOut) {
            logout();
        }
    }

    loadGate(permissions, languageId) {
        const { setLoadGate, fetchTranslations } = this.props;

        setPermissions(permissions);

        fetchTranslations({
            languageId,
            dictName: ['text', 'actionConfirmation']
        });
        setLoadGate(true);
    }

    render() {
        const { loaded } = this.props;

        return (
            <div className={style.h100pr}>
                { loaded ? this.props.children : <Loader /> }
            </div>
        );
    }
}

export default connect(
    ({ login, gate }) => ({
        cookieChecked: login.get('cookieChecked'),
        isLogout: login.get('isLogout'),
        authenticated: login.get('authenticated'),
        gateLoaded: login.get('gateLoaded'),
        result: login.get('result'),
        gate,
        forceLogOut: gate.get('forceLogOut'),
        loaded: gate.get('loaded')
    }),
    { cookieCheck, fetchTranslations, setLoadGate, logout }
)(Gate);

Gate.propTypes = {
    match: PropTypes.object,
    children: PropTypes.object,
    cookieChecked: PropTypes.bool,
    isLogout: PropTypes.bool,
    authenticated: PropTypes.bool,
    gateLoaded: PropTypes.bool,
    result: PropTypes.object,
    forceLogOut: PropTypes.bool,
    loaded: PropTypes.bool,
    cookieCheck: PropTypes.func,
    fetchTranslations: PropTypes.func,
    setLoadGate: PropTypes.func,
    logout: PropTypes.func
};

Gate.defaultProps = {
    gateLoaded: false,
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
