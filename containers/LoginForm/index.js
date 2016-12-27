import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import Form from '../../components/Form';
import { setInputValue, validateForm, identityCheck, resetForm } from './actions';

class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);

        this.handleChange = debounce(this.handleChange, 100);

        this.onSubmit = this.onSubmit.bind(this);

        this.submitForm = this.submitForm.bind(this);
    }

    componentWillMount() {
        this.props.resetForm();
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.login.get('authenticated') && nextProps.login.get('authenticated')) {
            this.context.router.push(this.context.mainUrl);
        }

        if (!this.props.isFormValid && nextProps.isFormValid) {
            this.submitForm(nextProps.loginData);
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

    submitForm(loginData) {
        let { identityCheck } = this.props;

        identityCheck(loginData);
    }

    render() {
        let { inputs, error, invalidField, titleMessage } = this.props;

        return (
            <Form
              className='loginForm'
              inputs={inputs}
              title={{className: 'loginTitle' + (error ? ' error' : ''), text: titleMessage }}
              buttons={[{label: 'Next', className: 'standardBtn loginBtn', type: 'submit'}]}
              onChange={this.onChange}
              onSubmit={this.onSubmit}
              error={error}
              invalidField={invalidField} />
        );
    }
}

export default connect(
    ({ login }) => {
        return {
            login,
            loginData: login.get('loginData'),
            inputs: login.get('loginForm').get('inputs'),
            titleMessage: login.get('loginForm').get('titleMessage'),
            error: login.get('loginForm').get('formError'),
            isFormValid: login.get('loginForm').get('isFormValid'),
            invalidField: login.get('loginForm').get('invalidField')
        };
    },
    { setInputValue, validateForm, identityCheck, resetForm }
)(LoginForm);

LoginForm.propTypes = {
    inputs: PropTypes.object,
    error: PropTypes.string,
    isFormValid: PropTypes.bool,
    setInputValue: PropTypes.func.isRequired,
    validateForm: PropTypes.func.isRequired,
    resetForm: PropTypes.func,
    identityCheck: PropTypes.func.isRequired,
    login: PropTypes.object,
    invalidField: PropTypes.string
};

// TODO: remove router from context
LoginForm.contextTypes = {
    router: PropTypes.object,
    mainUrl: PropTypes.string
};
