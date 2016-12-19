import Immutable from 'immutable';
import { LOGIN, SET_INPUT_VALUE, VALIDATE_FORM, COOKIE_CHECK, LOGOUT } from './actionTypes';
import { getInputs, inputs as inputsConfig } from './config';
import { Validator } from './../../utils/validator';

const validator = new Validator(inputsConfig);

let initialInputChangePerformed = false;

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
        invalidField: ''
    }
});

export const login = (state = defaultLoginState, action) => {
    let validationResult;

    switch (action.type) {
        case LOGOUT:
            initialInputChangePerformed = false;
            state = defaultLoginState;
            return state;
        case LOGIN:
            if (action.methodRequestState === 'finished') {
                // TODO: change condition
                if (action.error && action.error.type === 'policy.param.password') {
                // merge rendered username input with the new password input
                    return state.setIn(['loginForm', 'inputs', 'password'], Immutable.fromJS(getInputs(['password']).password));
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
            initialInputChangePerformed = true;

            return state.setIn(['loginForm', 'inputs', input, 'value'], value);
        case VALIDATE_FORM:
            // submitAfter to detect if validate comes from blur or submit
            validationResult = validator.validateAll(state.get('loginForm').get('inputs'));

            return initialInputChangePerformed ? state
                .setIn(['loginForm', 'isFormValid'], validationResult.isValid)
                .setIn(['loginForm', 'formError'], validationResult.error)
                .setIn(['loginForm', 'invalidField'], validationResult.invalidField) : state;

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
