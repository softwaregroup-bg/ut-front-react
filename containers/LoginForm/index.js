import React, {
    Component
} from 'react';
import {
    connect
} from 'react-redux';
import Form from '../../components/Form';
import { initForm, setInputValue } from './actions';

class LoginForm extends Component {
    componentWillMount() {
        this.props.initForm(['username', 'password']);
    }

    render() {
      const { setInputValue } = this.props;

        return (
            <Form
                className="loginForm"
                inputs={this.props.inputs}
                title={{className: 'loginTitle', text: 'Login'}}
                buttons={[{label: 'Next'}]}
                onChange={(event) => {
                    const { name, value } = event.target;

                    setInputValue({
                        input: name,
                        value
                    });
                }}
                onBlur={(event) => {debugger;}}
                onSubmit={(event) => {debugger;}} />
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
    { initForm, setInputValue }
)(LoginForm);
