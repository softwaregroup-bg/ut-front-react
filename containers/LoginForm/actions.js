import {
    LOGIN,
    BIO_LOGIN,
    COOKIE_CHECK,
    VALIDATE_FORM,
    LOGOUT,
    SET_INPUT_VALUE,
    CLEAR_LOGIN_STATE,
    SET_GATE_LOAD,
    GET_AZURE_CONN_DETAILS,
    RESET_PASSWORD,
    RESET_LOGIN_TO_INITIAL
} from './actionTypes';

const getTimezone = () => {
    const offset = (new Date()).getTimezoneOffset();
    const sign = offset > 0 ? '-' : '+';
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) - (hours * 60);
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
    params: Object.assign(params.toJS(), {$http: {uri: '/login'}, timezone: getTimezone(), channel: 'web'})
});

export const bioScan = () => ({
    type: BIO_LOGIN,
    method: 'bio.scan',
    suppressErrorWindow: true
});

export const cookieCheck = (params) => ({
    type: COOKIE_CHECK,
    method: 'identity.check',
    suppressErrorWindow: true,
    params: Object.assign({channel: 'web'}, (params || {}))
});

export const validateForm = () => ({
    type: VALIDATE_FORM
});

export const logout = (params) => {
    return {
        type: LOGOUT,
        method: 'identity.closeSession',
        suppressErrorWindow: true,
        params: params || {}
    };
};

export const clearLoginState = () => {
    return {
        type: CLEAR_LOGIN_STATE,
        params: {}
    };
};

export const setLoadGate = (value) => ({
    type: SET_GATE_LOAD,
    params: {value}
});

export const getAzureConnDetails = () => ({
    type: GET_AZURE_CONN_DETAILS,
    method: 'identity.getAzureConnDetails',
    params: {}
});

export const resetPassword = () => ({ type: RESET_PASSWORD });
export const resetLogin = () => ({ type: RESET_LOGIN_TO_INITIAL });
