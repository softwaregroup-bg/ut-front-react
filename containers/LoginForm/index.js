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
        debugger;
        return (
            <Form
                className="loginForm"
                inputs={this.props.inputs}
                title={{className: 'loginTitle', text: 'Login'}}
                buttons={[{label: 'Next'}]}
                handleSubmit={() => {}} />
        );
    }
}
// TODO: extract constants in separate file
export default connect(
    ({ login }) => {
        return {
          inputs: login.get('loginForm').get('inputs')
        };
    },
    { initForm }
)(LoginForm);
