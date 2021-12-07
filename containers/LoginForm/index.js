import React, { Component, PropTypes } from 'react';
import debounce from 'lodash.debounce';
import { fromJS } from 'immutable';
import Form from '../../components/Form';
import { cookieCheck, setInputValue, validateForm, identityCheck, bioScan, clearLoginState, getAzureConnDetails, resetPassword, resetLogin } from './actions';
import { closeAllTabs } from '../TabMenu/actions';
import { loginStoreConnectProxy as connect } from './storeProxy/loginStoreConnectProxy';
import style from './style.css';

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.handleChange = debounce(this.handleChange, 100);
        this.validateForm = this.validateForm.bind(this);
        this.syncInputsValuesWithStore = this.syncInputsValuesWithStore.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { authenticated, shouldSubmit, routerParams: {ssoOrigin, appId}, closeAllTabs } = this.props;
        if (nextProps.cookieChecked && nextProps.authenticated) {
            closeAllTabs();
            this.context.router.history.push('/');
        } else if (!authenticated && nextProps.authenticated) {
            if (ssoOrigin) {
                this.context.router.history.push(`/sso/${appId}/${ssoOrigin}`);
            } else {
                this.context.router.history.push(this.context.mainUrl);
            }
        }

        if (!shouldSubmit && nextProps.shouldSubmit) {
            this.submit(nextProps.loginType, nextProps.loginData);
        }
    }

    // componentWillMount() {
    //     const { match, cookieChecked, isLogout, authenticated, cookieCheck, azureConnDetails/* , loginData */ } = this.props;

    //     if (!cookieChecked && !isLogout) {
    //         let appId;
    //         if (match) {
    //             appId = match.params.appId;
    //         }
    //         cookieCheck({appId});
    //     } else if (authenticated) {
    //         // If user tries manually to go to /login page while he/she is logged in, redirects to
    //         this.context.router.history.push('/');
    //     }

    //     if (!azureConnDetails || azureConnDetails.size < 1) {
    //         this.props.getAzureConnDetails();
    //     }
    //     // if there is previously stored loginData, reset login state
    //     // this happens in cases when the user is logged in and navigates to /login again
    //     // if (loginData && loginData.has('username') && (loginData.get('username') || loginData.get('password'))) {
    //     //     clearLoginState();
    //     // }
    // }

    componentDidMount() {
        const { match, cookieChecked, isLogout, authenticated, cookieCheck, azureConnDetails/* , loginData */ } = this.props;

        if (!cookieChecked && !isLogout) {
            let appId;
            if (match) {
                appId = match.params.appId;
            }
            cookieCheck({appId});
        } else if (authenticated) {
            // If user tries manually to go to /login page while he/she is logged in, redirects to
            this.context.router.history.push('/');
        }

        if (!azureConnDetails || azureConnDetails.size < 1) {
            this.props.getAzureConnDetails();
        }
        // if there is previously stored loginData, reset login state
        // this happens in cases when the user is logged in and navigates to /login again
        // if (loginData && loginData.has('username') && (loginData.get('username') || loginData.get('password'))) {
        //     clearLoginState();
        // }
    }

    componentDidUpdate() {
        const { userType, azureConnDetails } = this.props;
        // if (!azureConnDetails || azureConnDetails.size < 1) {
        //     this.props.getAzureConnDetails();
        // }
        const connDetails = azureConnDetails && azureConnDetails.toJS && azureConnDetails.toJS();

        if (userType === 'policy.param.internalUserLogin') {
            const redirectUrl = encodeURIComponent(window.location.origin + '/auth/azureopenid/return');
            const azureLoginUrl = connDetails.ssoLoginUrl && connDetails.ssoLoginUrl.replace(/\${tenantId}/gi, connDetails.tenantId)
                .replace(/\${redirectUrl}/gi, redirectUrl)
                .replace(/\${clientId}/gi, connDetails.clientId)
                .replace(/\${state}/gi, connDetails.state);
            window.open(azureLoginUrl, '_self');
        }
    }

    onChange(e) {
        const { name, value } = e.target;
        e.persist();
        this.handleChange({ name, value });
    }

    handleChange({ name, value }) {
        const { setInputValue } = this.props;
        setInputValue({
            input: name,
            value
        });
    }

    syncInputsValuesWithStore(form) {
        const { setInputValue, inputs } = this.props;
        let allInputs = form.querySelectorAll('input');
        allInputs = Array.prototype.slice.call(allInputs); // convert NodeList to Array - required for IE
        allInputs.forEach((input) => {
            const { name, value } = input;
            // This sync does not apply to hidden fields
            const isHiddenField = input.getAttribute('data-hidden') === 'true';

            if (inputs.get(name) && inputs.get(name).get('value') !== value && !isHiddenField) {
                // If change and submit events happen in the 100ms debounce range
                // store won't be up to date with the current input values so sync is needed before validate the form
                setInputValue({ input: name, value });
            }
        });
    }

    validateForm(e) {
        const { validateForm } = this.props;

        e.preventDefault();
        this.syncInputsValuesWithStore(e.target);
        validateForm();
    }

    submit(loginType, loginData) {
        const { bioScan, identityCheck, routerParams: {appId} } = this.props;
        if (appId) {
            loginData = loginData.set('appId', appId);
        }
        if (loginType === 'initial') {
            const tmp = loginData && loginData.toJS();
            delete tmp.email;
            delete tmp.confirmEmail;
            loginData = fromJS(tmp);
        }
        loginType === 'bio' ? bioScan() : identityCheck(loginData);
    }

    render() {
        const { cookieChecked, isLogout, authenticated, inputs, error, title, buttonLabel, resetPassword, resetLogin } = this.props;
        const canResetPassword = inputs.hasIn(['username', 'value']) && inputs.has('password');
        const canLogin = inputs.has('email') && inputs.has('confirmEmail');
        const disableButton = error && error.includes('Email sent') && inputs.has('email') && inputs.has('confirmEmail');
        return (((cookieChecked && !authenticated) || isLogout) &&
            <div>
                <Form
                    ref='loginForm'
                    className='loginForm'
                    inputs={inputs}
                    title={{className: 'loginTitle' + (error ? ' error' : ''), text: title}}
                    buttons={[{label: buttonLabel, className: 'standardBtn loginBtn', type: 'submit', disabled: disableButton}]}
                    onChange={this.onChange}
                    onSubmit={this.validateForm}
                    error={error}
                />
                {(canResetPassword || canLogin) &&
                    <div className = {style.passReset}>
                        <a onClick = {canResetPassword ? resetPassword : resetLogin}>
                            {`${canResetPassword ? 'Forgot Password / Has olvidado tu contraseña' : 'Login / Acceso'}`}
                        </a>
                    </div>
                }
            </div>
        );
    }
}

export default connect(
    ({ login }) => {
        return {
            loginData: login.get('loginData'),
            cookieChecked: login.get('cookieChecked'),
            isLogout: login.get('isLogout'),
            authenticated: login.get('authenticated'),
            inputs: login.getIn(['loginForm', 'inputs']),
            title: login.getIn(['loginForm', 'title']),
            buttonLabel: login.getIn(['loginForm', 'buttonLabel']),
            error: login.get('formError'),
            shouldSubmit: login.getIn(['loginForm', 'shouldSubmit']),
            loginType: login.get('loginType'),
            userType: login.get('userType'),
            azureConnDetails: login.get('azureConnDetails')
        };
    },
    { cookieCheck, setInputValue, validateForm, identityCheck, bioScan, clearLoginState, closeAllTabs, getAzureConnDetails, resetPassword, resetLogin }
)(LoginForm);

LoginForm.propTypes = {
    match: PropTypes.object,
    routerParams: PropTypes.object,
    loginData: PropTypes.object,
    cookieChecked: PropTypes.bool,
    isLogout: PropTypes.bool,
    authenticated: PropTypes.bool,
    inputs: PropTypes.object,
    title: PropTypes.string,
    buttonLabel: PropTypes.string,
    error: PropTypes.string,
    loginType: PropTypes.any,
    userType: PropTypes.any,
    azureConnDetails: PropTypes.object,
    shouldSubmit: PropTypes.bool,
    invalidField: PropTypes.string,
    cookieCheck: PropTypes.func.isRequired,
    setInputValue: PropTypes.func.isRequired,
    validateForm: PropTypes.func.isRequired,
    identityCheck: PropTypes.func.isRequired,
    bioScan: PropTypes.func,
    clearLoginState: PropTypes.func,
    closeAllTabs: PropTypes.func,
    getAzureConnDetails: PropTypes.func,
    resetPassword: PropTypes.func,
    resetLogin: PropTypes.func
};

LoginForm.contextTypes = {
    router: PropTypes.object,
    mainUrl: PropTypes.string
};
