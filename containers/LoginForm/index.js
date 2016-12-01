import { connect } from 'react-redux';
import Form from '../../components/Form';

// TODO: extract constants in separate file
export default connect(
    (state) => ({
        className: 'loginForm',
        title: 'Login',
        inputs: [],
        buttons: [{
            className: 'connectBtn',
            label: 'Next'
        }]
    }),
    (dispatch) => ({
        handleSubmit: () => {}
    })
)(Form);
