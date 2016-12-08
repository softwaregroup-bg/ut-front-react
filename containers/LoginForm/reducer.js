import Immutable from 'immutable';
import {
    INIT_FORM,
    LOGIN,
    SET_INPUT_VALUE,
    SUBMIT_FORM,
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

const isFormValid = (state) => {
    var st = state.getIn(['loginForm', 'inputs']);

    return !(st.some((input) => {
        return input.get('error');
    }));
}

export const login = (state = defaultLoginState, action) => {
    switch (action.type) {
        case INIT_FORM:
            return state.setIn(['loginForm', 'inputs'], Immutable.fromJS(getInputs(action.inputs)));
        case LOGOUT:
            return state;
        case LOGIN:
            return state;
        case SET_INPUT_VALUE:
            let { input, value } = action;
            let { isValid, error } = validator(input, value);

            return state
                .setIn(['loginForm', 'inputs', input, 'value'], value);
                //.setIn(['loginForm', 'inputs', input, 'error'], error)
                //.setIn(['loginForm', 'isFormValid'], isFormValid(state));
        case SUBMIT_FORM:
            debugger;
            return state;
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
