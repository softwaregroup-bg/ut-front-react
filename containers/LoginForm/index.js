import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Form from '../../components/Form';
import { initForm, setInputValue, submitForm, validateForm } from './actions';
import _ from 'lodash';

class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);

        this.handleChange = _.debounce(this.handleChange, 300);

        this.onBlur = this.onBlur.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

        this.validateForm = _.debounce(this.validateForm, 500);
    }

    componentWillMount() {
        this.props.initForm(['username']);
    }

    handleChange(e) {
        let { name, value } = e.target;
        let { setInputValue } = this.props;

        setInputValue({
            input: name,
            value
        });
    }

    onChange(e) {
        e.persist();
        this.handleChange(e);
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

    validateForm({ submitAfter }) {
        this.props.validateForm({
            submitAfter
        });
    }

    render() {
        let { inputs, error } = this.props;

        return (
            <Form
              className='loginForm'
              inputs={inputs}
              title={{className: 'loginTitle', text: 'Login'}}
              buttons={[{label: 'Next', className: 'standardBtn loginBtn', type: 'submit'}]}
              onChange={this.onChange}
              onBlur={this.onBlur}
              onSubmit={this.onSubmit}
              error={error} />
        );
    }
}
// TODO: extract constants in separate file
export default connect(
    ({ login }) => {
        return {
            inputs: login.get('loginForm').get('inputs'),
            error: login.get('loginForm').get('formError'),
            isFormValid: login.get('loginForm').get('isFormValid')
        };
    },
    { initForm, setInputValue, submitForm, validateForm }
)(LoginForm);

LoginForm.propTypes = {
    inputs: PropTypes.object,
    initForm: PropTypes.func.isRequired,
    setInputValue: PropTypes.func.isRequired,
    submitForm: PropTypes.func.isRequired,
    validateForm: PropTypes.func.isRequired,
    error: PropTypes.string,
    isFormValid: PropTypes.bool
};
