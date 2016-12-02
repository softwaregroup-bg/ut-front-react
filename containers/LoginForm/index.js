import { connect } from 'react-redux';
import Form from '../../components/Form';

// TODO: extract constants in separate file
export default connect(
    (state) => ({
        className: 'loginForm',
        title: {
            className: 'loginTitle',
            text: 'Login'
        },
        inputs: [],
        buttons: [{
            label: 'Next'
        }]
    }),
    (dispatch) => ({
        handleSubmit: () => {}
    })
)(Form);
