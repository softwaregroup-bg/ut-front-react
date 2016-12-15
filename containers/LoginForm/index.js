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

        this.onBlur = this.onBlur.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

        this.validateForm = debounce(this.validateForm, 100);

        this.submitForm = this.submitForm.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.login.get('authenticated') && nextProps.login.get('authenticated')) {
            this.context.router.push(this.context.mainUrl);
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

    validateForm({ submitAfter }) {
        const { error, isFormValid } = this.props;
        this.props.validateForm({
            submitAfter
        });

        if (submitAfter && !error && isFormValid) {
            this.submitForm();
        }
    }

    onBlur(e) {
        this.validateForm({
            submitAfter: false
        });
    }

    onSubmit(e) {
        e.preventDefault();
        this.validateForm({
            submitAfter: true
        });
    }

    submitForm() {
        let { identityCheck, inputs } = this.props;
        let loginData = {};

        inputs.toSeq().forEach(input => {
            loginData[input.get('name')] = input.get('value');
        });

        identityCheck(loginData);
    }

    render() {
        let { inputs, error, invalidField } = this.props;

        return (
            <Form
              className='loginForm'
              inputs={inputs}
              title={{className: 'loginTitle' + (error ? ' error' : ''), text: 'Login'}}
              buttons={[{label: 'Next', className: 'standardBtn loginBtn', type: 'submit'}]}
              onChange={this.onChange}
              onBlur={this.onBlur}
              onSubmit={this.onSubmit}
              error={error}
              invalidField={invalidField} />
        );
    }
}
// TODO: extract constants in separate file
export default connect(
    ({ login }) => {
        return {
            login,
            inputs: login.get('loginForm').get('inputs'),
            error: login.get('loginForm').get('formError'),
            isFormValid: login.get('loginForm').get('isFormValid'),
            invalidField: login.get('loginForm').get('invalidField')
        };
    },
    { setInputValue, validateForm, identityCheck }
)(LoginForm);

LoginForm.propTypes = {
    inputs: PropTypes.object,
    error: PropTypes.string,
    isFormValid: PropTypes.bool,
    setInputValue: PropTypes.func.isRequired,
    validateForm: PropTypes.func.isRequired,
    identityCheck: PropTypes.func.isRequired,
    login: PropTypes.object,
    invalidField: PropTypes.string
};

// remove router from context
LoginForm.contextTypes = {
    router: PropTypes.object,
    mainUrl: PropTypes.string
};
