import Immutable from 'immutable';
import { LOGIN, SET_INPUT_VALUE, VALIDATE_FORM, COOKIE_CHECK, LOGOUT, RESET_FORM } from './actionTypes';
import { getInputs, inputs as inputsConfig } from './config';
import { Validator } from './../../utils/validator';

const validator = new Validator(inputsConfig);

const defaultLoginState = Immutable.fromJS({
    authenticated: false,
    shouldChangePassword: false,
    loginFailedAttepmts: 0,
    cookieChecked: false,
    loginForm: {
        inputs: getInputs(['username']),
        formError: '',
        shouldSubmit: false,
        invalidField: '',
        title: 'Login',
        buttonLabel: 'Next'
    },
    loginData: {}
});

const updateLoginData = (state) => {
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
        case RESET_FORM:
            state = defaultLoginState;
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
                } else if (action.error && action.error.type === 'policy.param.newPassword') {
                    // take only the username input from the current state and merge it with the new inputs for this step
                    let newInputs = state.getIn(['loginForm', 'inputs']).take(1).merge(getInputs(['newPassword', 'confirmPassword']));

                    return state.setIn(['loginForm', 'title'], 'Password change required')
                                .setIn(['loginForm', 'inputs'], newInputs)
                                .setIn(['loginForm', 'buttonLabel'], 'Change');
                } else if (action.error) {
                    return state.setIn(['loginForm', 'formError'], action.error.message);
                } else if (action.result) {
                    return state.set('authenticated', true)
                                .setIn(['loginForm', 'formError'], '')
                                .set('cookieChecked', true)
                                .setIn(['loginForm', 'formError'], '');
                }
            }

            return state;
        case SET_INPUT_VALUE:
            let { input, value } = action;
            return state.setIn(['loginForm', 'inputs', input, 'value'], value);
        case VALIDATE_FORM:
            let inputs = state.getIn(['loginForm', 'inputs']);
            let loginData = state.get('loginData');

            validationResult = validator.validateAll(inputs);

            if (validationResult.isValid) {
                loginData = updateLoginData(state);
            }

            return state.set('loginData', loginData)
                        .setIn(['loginForm', 'shouldSubmit'], validationResult.isValid)
                        .setIn(['loginForm', 'formError'], validationResult.error)
                        .setIn(['loginForm', 'invalidField'], validationResult.invalidField);

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
