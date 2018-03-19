import React, { Component, PropTypes } from 'react';
import debounce from 'lodash.debounce';

import Form from '../../components/Form';
import { setInputValue, validateForm, identityCheck, bioScan, clearLoginState } from './actions';
import { loginStoreConnectProxy as connect } from './storeProxy/loginStoreConnectProxy';

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
        const { loginData, clearLoginState } = this.props;

        // if there is previusly stored loginData, reset login state
        // this happens in cases when the user is logged in and navigates to /login again
        if (loginData.get('username') || loginData.get('password')) {
            clearLoginState();
        }
    }

    onChange(e) {
        let { name, value } = e.target;
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
        if (appId) {
            loginData = loginData.set('appId', appId);
        }
        loginType === 'bio' ? bioScan() : identityCheck(loginData);
    }

    render() {
        let { inputs, error, title, buttonLabel } = this.props;

        return (
            <Form
              ref='loginForm'
              className='loginForm'
              inputs={inputs}
              title={{className: 'loginTitle' + (error ? ' error' : ''), text: title}}
              buttons={[{label: buttonLabel, className: 'standardBtn loginBtn', type: 'submit'}]}
              onChange={this.onChange}
              onSubmit={this.validateForm}
              error={error} />
        );
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
            shouldSubmit: login.getIn(['loginForm', 'shouldSubmit']),
            loginType: login.get('loginType')
        };
    },
    { setInputValue, validateForm, identityCheck, bioScan, clearLoginState }
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
    clearLoginState: PropTypes.func
};

LoginForm.contextTypes = {
    router: PropTypes.object,
    mainUrl: PropTypes.string
};
