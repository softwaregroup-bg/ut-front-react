import { LOGIN, COOKIE_CHECK, VALIDATE_FORM, LOGOUT, SET_INPUT_VALUE, RESET_FORM } from './actionTypes';

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

export const identityCheck = (params) => {
    return {
        type: LOGIN,
        method: 'identity.check',
        suppressErrorWindow: true,
        params: Object.assign(params, {uri: '/login', timezone: getTimezone()})
    }
};

export const cookieCheck = () => ({
    type: COOKIE_CHECK,
    method: 'identity.check',
    suppressErrorWindow: true,
    params: {}
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

export const resetForm = () => ({
    type: RESET_FORM
});
