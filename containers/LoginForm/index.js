import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import Form from '../../components/Form';
import { setInputValue, validateForm, identityCheck } from './actions';

class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);

        this.handleChange = debounce(this.handleChange, 100);
        
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        let { authenticated, shouldSubmit, identityCheck } = this.props;

        if (!authenticated && nextProps.authenticated) {
            this.context.router.push(this.context.mainUrl);
        }

        if (!shouldSubmit && nextProps.shouldSubmit) {
            identityCheck(nextProps.loginData);
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

    onSubmit(e) {
        let { validateForm } = this.props;

        e.preventDefault();

        validateForm();
    }

    render() {
        let { inputs, error, title, buttonLabel, loginType } = this.props;

        console.log(loginType)

        return (
            <Form
              className='loginForm'
              inputs={inputs}
              title={{className: 'loginTitle' + (error ? ' error' : ''), text: title}}
              buttons={[{label: buttonLabel, className: 'standardBtn loginBtn', type: 'submit'}]}
              onChange={this.onChange}
              onSubmit={this.onSubmit}
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
    { setInputValue, validateForm, identityCheck }
)(LoginForm);

LoginForm.propTypes = {
    loginData: PropTypes.object,
    authenticated: PropTypes.bool,
    inputs: PropTypes.object,
    title: PropTypes.string,
    buttonLabel: PropTypes.string,
    error: PropTypes.string,
    shouldSubmit: PropTypes.bool,
    invalidField: PropTypes.string,
    setInputValue: PropTypes.func.isRequired,
    validateForm: PropTypes.func.isRequired,
    identityCheck: PropTypes.func.isRequired
};

LoginForm.contextTypes = {
    router: PropTypes.object,
    mainUrl: PropTypes.string
};
