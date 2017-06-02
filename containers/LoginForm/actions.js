import {
    LOGIN,
    BIO_LOGIN,
    COOKIE_CHECK,
    VALIDATE_FORM,
    LOGOUT,
    SET_INPUT_VALUE,
    CLEAR_LOGIN_STATE
} from './actionTypes';

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
    params: Object.assign(params.toJS(), {uri: '/login', timezone: getTimezone(), channel: 'web'})
});

export const bioScan = () => ({
    type: BIO_LOGIN,
    method: 'bio.scan',
    suppressErrorWindow: true
});

export const cookieCheck = () => ({
    type: COOKIE_CHECK,
    method: 'identity.check',
    suppressErrorWindow: true,
    params: {channel: 'web'}
});

export const validateForm = () => ({
    type: VALIDATE_FORM
});

export const logout = (params) => ({
    type: LOGOUT,
    method: 'identity.closeSession',
    suppressErrorWindow: true,
    params: {}
});

export const clearLoginState = () => ({
    type: CLEAR_LOGIN_STATE,
    params: {}
});
