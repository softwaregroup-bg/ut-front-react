import React, { Component, PropTypes } from 'react';
import debounce from 'lodash.debounce';
import Form from '../../components/Form';
import { setInputValue, validateForm, identityCheck, bioScan, clearLoginState, forgottenPasswordReset, changeLoginType } from './actions';
import { loginStoreConnectProxy as connect } from './storeProxy/loginStoreConnectProxy';
import ReCAPTCHA from 'react-google-recaptcha';
import style from './style.css';
import Immutable from 'immutable';

class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);

        this.handleChange = debounce(this.handleChange, 100);

        this.validateForm = this.validateForm.bind(this);

        this.syncInputsValuesWithStore = this.syncInputsValuesWithStore.bind(this);

        this.submit = this.submit.bind(this);

        this.onForgotPasswordClick = this.onForgotPasswordClick.bind(this);
        this.state = {};
    }

    componentWillReceiveProps(nextProps) {
        let { authenticated, shouldSubmit, routerParams: {ssoOrigin, appId} } = this.props;

        if (!authenticated && nextProps.authenticated) {
            if (ssoOrigin) {
                this.context.router.push(`/sso/${appId}/${ssoOrigin}`);
            } else {
                this.context.router.push(this.context.mainUrl);
            }
        }

        if (!shouldSubmit && nextProps.shouldSubmit) {
            this.submit(nextProps.loginType, nextProps.loginData);
        }
    }

    componentWillMount() {
        const { clearLoginState } = this.props;
        clearLoginState();
    }

    onChange(e) {
        let { name, value } = e.target;
        if (name === 'captcha') {
            this.captchaValue = value;
            return ;
        }
        e.persist();
        this.handleChange({ name, value });
    }

    handleChange({ name, value }) {
        let { setInputValue } = this.props;

        setInputValue({
            input: name,
            value
        });
    }

    onForgotPasswordClick() {
        let loginData = {
            username:   this.refs.loginForm &&
                        this.refs.loginForm.refs &&
                        this.refs.loginForm.refs.username &&
                        this.refs.loginForm.refs.username.refs && 
                        this.refs.loginForm.refs.username.refs.inputNode && 
                        this.refs.loginForm.refs.username.refs.inputNode.value
        };
        loginData.captcha = this.captchaValue;
        this.props.forgottenPasswordReset(loginData)
        .then(r => {
            this.captcha.reset();
            this.captchaValue = undefined;
        })
        .catch(e => {
            this.captcha.reset();
            this.captchaValue = undefined;
        })
    }

    syncInputsValuesWithStore(form) {
        const { setInputValue, inputs } = this.props;
        let allInputs = form.querySelectorAll('input');
        allInputs = Array.prototype.slice.call(allInputs); // convert NodeList to Array - required for IE
        allInputs.forEach((input) => {
            let { name, value } = input;
            // This sync does not apply to hidden fields
            let isHiddenField = input.getAttribute('data-hidden') === 'true';

            if (inputs.get(name) && inputs.get(name).get('value') !== value && !isHiddenField) {
                // If change and submit events happen in the 100ms debounce range
                // store won't be up to date with the current input values so sync is needed before validate the form
                setInputValue({ input: name, value });
            }
        });
    }

    validateForm(e) {
        let { validateForm } = this.props;

        e.preventDefault();
        this.syncInputsValuesWithStore(e.target);
        validateForm();
    }

    submit(loginType, loginData) {
        let { bioScan, identityCheck, routerParams: {appId} } = this.props;
        var captcha = this.captcha;
        if (appId) {
            loginData = loginData.set('appId', appId);
        }
        if (this.captchaValue) {
            loginData = loginData.set('captcha', this.captchaValue);
        }
        switch (loginType) {
            case 'bio':
                bioScan();
                break;
            case 'forgottenPasswordReset':
                this.props.changeLoginType('password');
                break;
            default:
                identityCheck(loginData)
                .then(r => {
                    captcha.reset();
                    this.captchaValue = undefined;
                    loginData.set('captcha', undefined);
                })
                .catch(e => {
                    captcha.reset();
                    this.captchaValue = undefined;
                    loginData.set('captcha', undefined);
                });
        }
    }
    onChangeCaptcha = (value) => {
        this.captchaValue = value;
        this.setState({captchaValue: value});
    };
    
    render() {
        let { inputs, error, title, buttonLabel, formMessage } = this.props;
        if (document.captchaConfig) {
            if (document.captchaConfig.mockField) {
                inputs = inputs.set('captcha', Immutable.fromJS({
                    name: 'captcha',
                    type: 'text',
                    label: 'captcha',
                    value: this.state.captchaValue ,
                    error: '',
                    validateOrder: ['isRequired', 'minLength', 'maxLength'],
                    validations: {
                        isRequired: true,
                        minLength: 2,
                        maxLength: 200
                    }
                }))
            }
            inputs = inputs.set('customInput_captcha', (
                <div
                className={style.recaptchaResize}
                >
                <ReCAPTCHA
                    key='customInput_captcha'
                    ref={(el) => { this.captcha = el; }}
                    sitekey={document.captchaConfig.sitekey}
                    onChange={this.onChangeCaptcha}
                />
                </div>
            ));
        }
        return (<div>
            <Form
              ref='loginForm'
              className='loginForm'
              inputs={inputs}
              title={{className: 'loginTitle' + (error ? ' error' : ''), text: title}}
              buttons={[{label: buttonLabel, className: 'standardBtn loginBtn', type: 'submit'}]}
              onChange={this.onChange}
              onSubmit={this.validateForm}
              error={error}
              message={formMessage}
                />
            {inputs.get('password') && <a onClick={this.onForgotPasswordClick} className={style.forgotPasswordLabel}>Forgot Password</a>}
        </div>);
    }
}

export default connect(
    ({ login }) => {
        return {
            loginData: login.get('loginData'),
            authenticated: login.get('authenticated'),
            inputs: login.getIn(['loginForm', 'inputs']),
            title: login.getIn(['loginForm', 'title']),
            buttonLabel: login.getIn(['loginForm', 'buttonLabel']),
            error: login.get('formError'),
            formMessage: login.get('formMessage'),
            shouldSubmit: login.getIn(['loginForm', 'shouldSubmit']),
            loginType: login.get('loginType')
        };
    },
    { setInputValue, validateForm, identityCheck, bioScan, clearLoginState, forgottenPasswordReset, changeLoginType }
)(LoginForm);

LoginForm.propTypes = {
    routerParams: PropTypes.object,
    loginData: PropTypes.object,
    authenticated: PropTypes.bool,
    inputs: PropTypes.object,
    title: PropTypes.string,
    buttonLabel: PropTypes.string,
    error: PropTypes.string,
    loginType: PropTypes.any,
    shouldSubmit: PropTypes.bool,
    invalidField: PropTypes.string,
    setInputValue: PropTypes.func.isRequired,
    validateForm: PropTypes.func.isRequired,
    identityCheck: PropTypes.func.isRequired,
    bioScan: PropTypes.func,
    clearLoginState: PropTypes.func,
    forgottenPasswordReset: PropTypes.func,
    changeLoginType: PropTypes.func,
    formMessage: PropTypes.string
};

LoginForm.contextTypes = {
    router: PropTypes.object,
    mainUrl: PropTypes.string
};
