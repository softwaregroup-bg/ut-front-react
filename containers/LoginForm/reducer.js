import Immutable from 'immutable';
import {
    INIT_FORM,
    LOGIN,
    SET_INPUT_VALUE,
    SUBMIT_FORM,
    VALIDATE_FORM,
    CHECK_COOKIE,
    SET_LOGIN_DATA,
    LOGOUT
} from './actionTypes';
import {
    getInputs,
    inputs as inputsConfig
} from './config';
import { createValidatorPerForm } from './../../utils/validator';

const validator = createValidatorPerForm(inputsConfig);

const defaultLoginState = Immutable.fromJS({
    authenticated: false,
    changeId: 0,
    loginResultId: 0,
    logOutResultId: 0,
    cookieCheckResultId: 0,
    loginForm: {
        inputs: {},
        formError: '',
        isFormValid: false
    }
});

const defaultLoginDataState = Immutable.fromJS({
    changeId: 0,
    data: {}
});

const validateAllInputs = (inputs) => {
    let validationError = '';

    let isValid = inputs.every((input, key) => {
        const value = input.get('value');
        const validationResult = validator(key, value);
        validationError = validationResult.error;

        return validationResult.isValid;
    });

    return {
        isValid,
        error: validationError
    };
};

export const login = (state = defaultLoginState, action) => {
    let validationResult;

    switch (action.type) {
        case INIT_FORM:
            return state.setIn(['loginForm', 'inputs'], Immutable.fromJS(getInputs(action.inputs)));

        case LOGOUT:
            return state;

        case LOGIN:
            return state;

        case SET_INPUT_VALUE:
            let { input, value } = action;

            return state
                .setIn(['loginForm', 'inputs', input, 'value'], value);;

        case VALIDATE_FORM:
            // submitAfter to detect if validate comes from blur or submit
            validationResult = validateAllInputs(state.get('loginForm').get('inputs'));

            return state
                .setIn(['loginForm', 'isFormValid'], validationResult.isValid)
                .setIn(['loginForm', 'formError'], validationResult.error);

        case SUBMIT_FORM:
            validationResult = validateAllInputs(state.get('loginForm').get('inputs'));

            return state
                .setIn(['loginForm', 'isFormValid'], validationResult.isValid)
                .setIn(['loginForm', 'formError'], validationResult.error);

        case CHECK_COOKIE:
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
