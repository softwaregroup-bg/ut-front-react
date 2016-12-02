import Immutable from 'immutable';
import {
    LOGIN,
    CHECK_COOKIE,
    SET_LOGIN_DATA,
    LOGOUT
} from './actionTypes';

const defaultLoginState = Immutable.fromJS({
    authenticated: false,
    changeId: 0,
    loginResultId: 0,
    logOutResultId: 0,
    cookieCheckResultId: 0,
    loginForm: {
        isValid: true,
        fileds: [{
            name: 'username',
            type: 'text',
            value: '',
            error: '',
            validations: {
                isRequired: true,
                minLength: 2,
                maxLength: 30
            }
        }]
    }
});

const defaultLoginDataState = Immutable.fromJS({
    changeId: 0,
    data: {}
});

export const login = (state = defaultLoginState, action) => {
    switch (action.type) {
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
