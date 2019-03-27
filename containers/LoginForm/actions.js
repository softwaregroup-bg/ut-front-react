import {
    LOGIN,
    BIO_LOGIN,
    COOKIE_CHECK,
    VALIDATE_FORM,
    LOGOUT,
    SET_INPUT_VALUE,
    CLEAR_LOGIN_STATE,
    RESET_FORGOTTEN_PASSWORD,
    CHANGE_LOGIN_TYPE
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

export const identityCheck = (params) => (dispatch, getStore) => {
    const store = getStore();
    const channel = (store.channelConfig && store.channelConfig.channel) || 'web';

    return dispatch({
        type: LOGIN,
        method: 'identity.check',
        suppressErrorWindow: true,
        params: Object.assign(params.toJS(), {uri: '/login', timezone: getTimezone(), channel: channel})
    });
};

export const bioScan = () => ({
    type: BIO_LOGIN,
    method: 'bio.scan',
    suppressErrorWindow: true
});

export const cookieCheck = (params) => (dispatch, getStore) => {
    const store = getStore();
    const channel = (store.channelConfig && store.channelConfig.channel) || 'web';

    dispatch({
        type: COOKIE_CHECK,
        method: 'identity.check',
        suppressErrorWindow: true,
        params: Object.assign({channel: channel}, (params || {}))
    });
};

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

export const forgottenPasswordReset = (params = {}) => (dispatch, getStore) => {
    return dispatch({
        method: 'cibUser.forgottenPasswordReset',
        type: RESET_FORGOTTEN_PASSWORD,
        params: {
            username: params.username,
            otp: params.otp,
            newPassword: params.newPassword
        },
        methodType: params.otp ? 'forgottenPasswordReset' : 'forgottenPasswordResetSendOTP'
    });
};

export const changeLoginType = (type) => ({
    type: CHANGE_LOGIN_TYPE,
    params: {
        loginType: type
    }
});
