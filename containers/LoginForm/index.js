import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Form from '../../components/Form';
import { initForm, setInputValue } from './actions';

class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);

        this.onBlur = this.onBlur.bind(this);

        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillMount() {
        this.props.initForm(['username', 'password']);
    }

    onChange(e) {
        let { name, value } = e.target;
        let { setInputValue } = this.props;

        setInputValue({
            input: name,
            value
        });
    }

    onBlur(e) {
    }

    onSubmit(e) {
    }

    render() {
        let { inputs, error } = this.props;

        return (
            <Form
              className='loginForm'
              inputs={inputs}
              title={{className: 'loginTitle', text: 'Login'}}
              buttons={[{label: 'Next', className: 'standardBtn loginBtn'}]}
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
            error: login.get('loginForm').get('formError')
        };
    },
    { initForm, setInputValue }
)(LoginForm);

LoginForm.propTypes = {
    inputs: PropTypes.object,
    initForm: PropTypes.func.isRequired,
    setInputValue: PropTypes.func.isRequired,
    error: PropTypes.string
};
