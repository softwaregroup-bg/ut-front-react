import Immutable from 'immutable';
import {
    LOGIN,
    SET_INPUT_VALUE,
    VALIDATE_FORM,
    CHECK_COOKIE,
    SET_LOGIN_DATA,
    LOGOUT
} from './actionTypes';
import {
    getInputs,
    inputs as inputsConfig
} from './config';
import { Validator } from './../../utils/validator';

const validator = new Validator(inputsConfig);

let initialInputChangePerformed = false;

const defaultLoginState = Immutable.fromJS({
    authenticated: false,
    changeId: 0,
    loginResultId: 0,
    logOutResultId: 0,
    cookieCheckResultId: 0,

    loginForm: {
        inputs: getInputs(['username']),
        formError: '',
        isFormValid: false,
        invalidField: ''
    }
});

const defaultLoginDataState = Immutable.fromJS({
    changeId: 0,
    data: {}
});

export const login = (state = defaultLoginState, action) => {
    let validationResult;

    switch (action.type) {
        case LOGOUT:
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
                                .set('cookieCheckResultId', 0)
                                .setIn(['loginForm', 'formError'], '');
                }
            }

            return state;

        case SET_INPUT_VALUE:
            let { input, value } = action;
            initialInputChangePerformed = true;

            return state
                .setIn(['loginForm', 'inputs', input, 'value'], value);

        case VALIDATE_FORM:
            // submitAfter to detect if validate comes from blur or submit
            validationResult = validator.validateAll(state.get('loginForm').get('inputs'));

            return initialInputChangePerformed ? state
                .setIn(['loginForm', 'isFormValid'], validationResult.isValid)
                .setIn(['loginForm', 'formError'], validationResult.error)
                .setIn(['loginForm', 'invalidField'], validationResult.invalidField) : state;

        case CHECK_COOKIE:
            if (action.methodRequestState === 'finished') {
                if (action.error) {
                    return state
                        .setIn(['loginForm', 'formError'], Immutable.fromJS({code: action.error.code, message: action.error.message, type: action.error.type}))
                        .delete('result')
                        .update('cookieCheckResultId', (v) => (v + 1))
                        .set('authenticated', false);
                } else if (action.result) {
                    return state
                        .set('result', Immutable.fromJS(action.result))
                        .update('cookieCheckResultId', (v) => (v + 1))
                        .set('authenticated', true);
                }
            }
            return state;
        default:
            return state;
    }
};

export const loginData = (state = defaultLoginDataState, action) => {
    switch (action.type) {
        case SET_LOGIN_DATA:
            return state;
        default:
            return state;
    }
};
