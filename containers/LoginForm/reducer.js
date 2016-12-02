import Immutable from 'immutable';
import {
    INIT_FORM,
    LOGIN,
    CHECK_COOKIE,
    SET_LOGIN_DATA,
    LOGOUT
} from './actionTypes';
import { getInputs } from './config';

const defaultLoginState = Immutable.fromJS({
    authenticated: false,
    changeId: 0,
    loginResultId: 0,
    logOutResultId: 0,
    cookieCheckResultId: 0,
    loginForm: {
        inputs: []
    }
});

const defaultLoginDataState = Immutable.fromJS({
    changeId: 0,
    data: {}
});

export const login = (state = defaultLoginState, action) => {
    switch (action.type) {
        case INIT_FORM:
            var obj =  Immutable.fromJS(getInputs(action.inputs));
            return obj;
            debugger;
        case LOGOUT:
            return state;
        case LOGIN:
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
