import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import Loader from '../../components/Loader';
import { cookieCheck, logout } from '../LoginForm/actions.js';
import { fetchTranslations, fetchLanguages } from './actions';
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
        let { cookieCheck, params: {appId} } = this.props;

        cookieCheck({appId});
    }

    componentWillReceiveProps(nextProps) {
        let { cookieChecked, authenticated, result, forceLogOut, logout, params: {ssoOrigin, appId} } = this.props;

        // if cookieCheck has passed and the user is authenticated, redirect to LoginPage
        // if the user is authenticated and there is a result from identity.check, load the gate (set permissions and fetch translations)
        // if the session expires, redirect to LoginPage
        if (!cookieChecked && nextProps.cookieChecked && !nextProps.authenticated) {
            if (ssoOrigin) {
                this.context.router.push(`/sso/${appId}/${ssoOrigin}/login`);
            } else {
                this.context.router.push('/login');
            }
        } else if (nextProps.authenticated && !result && nextProps.result) {
            this.loadGate(nextProps.result.get('permission.get').toJS(), nextProps.result.getIn(['language', 'languageId']));
        } else if (!nextProps.result && authenticated && !nextProps.authenticated) {
            this.context.router.push('/login');
        } else if (!forceLogOut && nextProps.forceLogOut) {
            logout();
        }
    }

    loadGate(permissions, languageId) {
        const { fetchTranslations, fetchLanguages, platform, projectConfig } = this.props;        

        setPermissions(permissions);

        const shouldTranslate = projectConfig.getIn(['features', 'translate', platform]);

        const dictName = ['text', 'actionConfirmation'];

        // Feature requested October 2018 - use a config file to turn translations ON and OFF per each web portal
        if (shouldTranslate) {
            fetchTranslations({ languageId, dictName });
        } else {
            fetchLanguages()
                .then(res => {
                    const languages = res.result && res.result[0];
                    
                    const defaultLanguage = languages.find(l => l.iso2Code === 'en');
                    const defaultLanguageId = defaultLanguage ? defaultLanguage.languageId : languages[0].languageId;

                    fetchTranslations({ languageId: defaultLanguageId, dictName });
                });
        }
    }

    render() {
        let { loaded } = this.props;

        return (
            <div className={style.h100pr}>
                { loaded ? this.props.children : <Loader /> }
            </div>
        );
    }
}

export default connect(
    ({ login, gate, platform, projectConfig }) => ({
        cookieChecked: login.get('cookieChecked'),
        authenticated: login.get('authenticated'),
        result: login.get('result'),
        gate: gate,
        forceLogOut: gate.get('forceLogOut'),
        loaded: gate.get('loaded'),
        platform: platform.get('name'),
        projectConfig: projectConfig
    }),
    { cookieCheck, fetchTranslations, fetchLanguages, logout }
)(Gate);

Gate.propTypes = {
    params: PropTypes.object,
    children: PropTypes.object,
    cookieChecked: PropTypes.bool,
    authenticated: PropTypes.bool,
    result: PropTypes.object,
    platform: PropTypes.string,
    projectConfig: PropTypes.object,
    forceLogOut: PropTypes.bool,
    loaded: PropTypes.bool,
    cookieCheck: PropTypes.func,
    fetchTranslations: PropTypes.func,
    fetchLanguages: PropTypes.func,
    logout: PropTypes.func
};

Gate.defaultProps = {
    gate: Map(),
    login: Map(),
    platform: '',
    projectConfig: Map()
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
