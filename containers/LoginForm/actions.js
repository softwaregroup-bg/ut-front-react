import { LOGIN, CHECK_COOKIE, VALIDATE_FORM, SET_LOGIN_DATA, LOGOUT, SET_INPUT_VALUE } from './actionTypes';

const getTimezone = () => {
    let offset = (new Date()).getTimezoneOffset();
    let sign = offset > 0 ? '-' : '+';
    let hours = Math.floor(Math.abs(offset) / 60);
    let minutes = Math.abs(offset) - (hours * 60);
    return `${sign}${('00' + hours.toString()).substr(-2)}:${('00' + minutes.toString()).substr(-2)}`;
};

export const setInputValue = ({ input, value }) => ({
    type: SET_INPUT_VALUE,
    input,
    value
});

export const identityCheck = (params) => ({
    type: LOGIN,
    method: 'identity.check',
    suppressErrorWindow: true,
    params: Object.assign(params, {uri: '/login', timezone: getTimezone()})
});

export const cookieCheck = () => ({
    type: CHECK_COOKIE,
    method: 'identity.check',
    suppressErrorWindow: true,
    params: {}
});

export const validateForm = ({ submitAfter }) => ({
    type: VALIDATE_FORM,
    submitAfter
});

export const setLoginData = (data) => ({
    type: SET_LOGIN_DATA,
    data: (data instanceof Array) ? data : [data]
});

export const logout = (params) => ({
    type: LOGOUT,
    method: 'identity.closeSession',
    suppressErrorWindow: true,
    params: {}
});
