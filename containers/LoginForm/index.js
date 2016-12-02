import React, {
    Component
} from 'react';
import {
    connect
} from 'react-redux';
import Form from '../../components/Form';
import { initForm } from './actions';

class LoginForm extends Component {
    componentWillMount() {
        this.props.initForm(['username', 'password']);
    }

    render() {
        return (
            <Form
                className="loginForm"
                inputs={this.props.inputs}
                title={{className: 'loginTitle', text: 'Login'}}
                buttons={[{label: 'Next'}]} />
        );
    }
}
// TODO: extract constants in separate file
export default connect(
    ({ loginForm }) => {
        return {
          inputs: loginForm.inputs
        };
    },
    { initForm }
)(LoginForm);
