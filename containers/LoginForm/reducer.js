import Immutable from 'immutable';
import {
    INIT_FORM,
    LOGIN,
    SET_INPUT_VALUE,
    CHECK_COOKIE,
    SET_LOGIN_DATA,
    LOGOUT
} from './actionTypes';
import {
    getInputs
} from './config';

const defaultLoginState = Immutable.fromJS({
    authenticated: false,
    changeId: 0,
    loginResultId: 0,
    logOutResultId: 0,
    cookieCheckResultId: 0,
    loginForm: {
        inputs: {},
        formError: ''
    }
});

const defaultLoginDataState = Immutable.fromJS({
    changeId: 0,
    data: {}
});

export const login = (state = defaultLoginState, action) => {
    switch (action.type) {
        case INIT_FORM:
            return state.setIn(['loginForm', 'inputs'], Immutable.fromJS(getInputs(action.inputs)));
        case LOGOUT:
            return state;
        case LOGIN:
            return state;
        case SET_INPUT_VALUE:
            return state.setIn(['loginForm', 'inputs', action.input, 'value'], action.value);
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
