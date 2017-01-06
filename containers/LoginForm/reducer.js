import Immutable from 'immutable';
import { LOGIN, SET_INPUT_VALUE, VALIDATE_FORM, COOKIE_CHECK, LOGOUT } from './actionTypes';
import { getInputs, inputs as inputsConfig } from './config';
import { Validator } from './../../utils/validator';

const validator = new Validator(inputsConfig);

const defaultLoginState = Immutable.fromJS({
    authenticated: false,
    cookieChecked: false,
    loginForm: {
        inputs: getInputs(['username']),
        formError: '',
        shouldSubmit: false,
        invalidField: '',
        title: 'System Login',
        buttonLabel: 'Next'
    },
    loginData: {}
});

const getLoginData = (state) => {
    let inputs = state.getIn(['loginForm', 'inputs']);
    let currentLoginData = state.get('loginData');

    inputs.toSeq().forEach(input => {
        if (!input.get('skipSubmit')) {
            currentLoginData = currentLoginData.set(input.get('name'), input.get('value'));
        }
    });

    return currentLoginData;
};

export const login = (state = defaultLoginState, action) => {
    let validationResult;
    switch (action.type) {
        case LOGOUT:
            return state;
        case LOGIN:
            if (action.methodRequestState === 'finished') {
                state = state.setIn(['loginForm', 'shouldSubmit'], false);
                // show password input and change title
                if (action.error && action.error.type === 'policy.param.password') {
                    return state.setIn(['loginForm', 'inputs', 'password'], Immutable.fromJS(getInputs(['password']).password))
                                .setIn(['loginForm', 'inputs', 'username', 'disabled'], true)
                                .setIn(['loginForm', 'title'], Immutable.fromJS('Login with password'))
                                .setIn(['loginForm', 'buttonLabel'], 'Login')
                                .setIn(['loginForm', 'formError'], '');
                } else if (action.error && action.error.type === 'policy.param.newPassword') {
                    // take only the username input from the current state and merge it with the new inputs for this step
                    let newInputs = state.getIn(['loginForm', 'inputs']).take(1).merge(getInputs(['newPassword', 'confirmPassword']));

                    return state.setIn(['loginForm', 'title'], 'Password change required')
                                .setIn(['loginForm', 'inputs'], newInputs)
                                .setIn(['loginForm', 'buttonLabel'], 'Change')
                                .setIn(['loginForm', 'formError'], '');
                } else if (action.error && action.error.type === 'policy.param.otp') {
                    let newInputs = state.getIn(['loginForm', 'inputs']).take(1).merge(getInputs(['otp']));

                    return state.setIn(['loginForm', 'inputs'], newInputs)
                                .setIn(['loginForm', 'inputs', 'username', 'disabled'], true)
                                .setIn(['loginForm', 'title'], Immutable.fromJS('Login with OTP code'))
                                .setIn(['loginForm', 'buttonLabel'], 'Login')
                                .setIn(['loginForm', 'formError'], '');
                } else if (action.error) {
                    return state.setIn(['loginForm', 'formError'], action.error.message);
                } else if (action.result) {
                    return state.set('authenticated', true)
                                .set('cookieChecked', true)
                                .setIn(['loginForm', 'formError'], '');
                }
            }
            return state;
        case SET_INPUT_VALUE:
            return state.setIn(['loginForm', 'inputs', action.input, 'value'], action.value);
        case VALIDATE_FORM:
            validationResult = validator.validateAll(state.getIn(['loginForm', 'inputs']));

            if (validationResult.isValid) {
                let prevInvalidField = state.getIn(['loginForm', 'inputs']).find(input => input.get('error'));

                if (prevInvalidField) {
                    state = state.setIn(['loginForm', 'inputs', prevInvalidField.get('name'), 'error'], '');
                }

                state = state.set('loginData', getLoginData(state));
            } else {
                state = state.setIn(['loginForm', 'inputs', validationResult.invalidField, 'error'], validationResult.error)
                              .setIn(['loginForm', 'formError'], '');
            }

            return state.setIn(['loginForm', 'shouldSubmit'], validationResult.isValid);

        case COOKIE_CHECK:
            if (action.methodRequestState === 'finished') {
                if (action.error) {
                    return state.delete('result')
                                .set('cookieChecked', true)
                                .set('authenticated', false);
                } else if (action.result) {
                    return state.set('result', Immutable.fromJS(action.result))
                                .set('cookieChecked', true)
                                .set('authenticated', true);
                }
            }
            return state;
        default:
            return state;
    }
};
