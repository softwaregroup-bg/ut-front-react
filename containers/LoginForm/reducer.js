import Immutable from 'immutable';
import { LOGIN, SET_INPUT_VALUE, VALIDATE_FORM, COOKIE_CHECK, LOGOUT, RESET_FORM } from './actionTypes';
import { getInputs, inputs as inputsConfig } from './config';
import { Validator } from './../../utils/validator';

const validator = new Validator(inputsConfig);

// TODO: check loginResultId, logOutResultId, cookieCheckResultId, changeId
const defaultLoginState = Immutable.fromJS({
    authenticated: false,
    shouldChangePassword: false,
    loginFailedAttepmts: 0,
    cookieChecked: false,
    loginForm: {
        inputs: getInputs(['username']),
        formError: '',
        isFormValid: false,
        invalidField: '',
        titleMessage: 'Login'
    },
    loginData: {}
});

const setLoginData = (state) => {
    let inputs = state.getIn(['loginForm', 'inputs']);
    let loginData = state.get('loginData');

    inputs.toSeq().forEach(input => {
        if(!input.get('skipSubmit')) {
            state = state.setIn(['loginData', input.get('name')], input.get('value'))
        }
    });

    return state;
}

export const login = (state = defaultLoginState, action) => {
    let validationResult;

    switch (action.type) {
        case LOGOUT:
        case RESET_FORM:
            state = defaultLoginState;
            return state;
        case LOGIN:
            if (action.methodRequestState === 'finished') {
                state = state.setIn(['loginForm', 'isFormValid'], false);
                // show password input and change title
                if (action.error && action.error.type === 'policy.param.password') {
                    return state.setIn(['loginForm', 'inputs', 'password'], Immutable.fromJS(getInputs(['password']).password))
                                .setIn(['loginForm', 'titleMessage'], Immutable.fromJS('Login with password'));
                } else if (action.error && action.error.type === 'policy.param.newPassword') {
                    return state.setIn(['loginForm', 'inputs'], Immutable.fromJS(getInputs(['newPassword', 'confirmPassword'])));
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

            validationResult = validator.validateAll(inputs);

            if(validationResult.isValid) {
                state = setLoginData(state);
            }

            return state.setIn(['loginForm', 'isFormValid'], validationResult.isValid)
                        .setIn(['loginForm', 'formError'], validationResult.error)
                        .setIn(['loginForm', 'invalidField'], validationResult.invalidField);

        case COOKIE_CHECK:
            if (action.methodRequestState === 'finished') {
                if (action.error) {
                    if(action.error.type === 'policy.param.newPassword') {

                    }
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
