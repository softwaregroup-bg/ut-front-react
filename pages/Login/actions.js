export const actionList = {
    LOGOUT: Symbol('LOGOUT'),
    COOKIE_CHECK: Symbol('COOKIE_CHECK'),
    LOGIN_DATA: Symbol('LOGIN_DATA'),
    LOGIN: Symbol('LOGIN')
};
const getTimezone = () => {
    let offset = (new Date()).getTimezoneOffset();
    let sign = offset > 0 ? '-' : '+';
    let hours = Math.floor(Math.abs(offset) / 60);
    let minutes = Math.abs(offset) - (hours * 60);
    return `${sign}${('00' + hours.toString()).substr(-2)}:${('00' + minutes.toString()).substr(-2)}`;
};

export const identityCheck = (params) => ({
    type: actionList.LOGIN,
    method: 'identity.check',
    suppressErrorWindow: true,
    params: Object.assign(params, {$http: {uri: '/login'}, timezone: getTimezone()})
});

export const logout = (params) => ({
    type: actionList.LOGOUT,
    method: 'identity.closeSession',
    suppressErrorWindow: true,
    params: {}
});

export const setLoginData = (data) => ({
    type: actionList.LOGIN_DATA,
    data: (data instanceof Array) ? data : [data]
});

export const cookieCheck = () => ({
    type: actionList.COOKIE_CHECK,
    suppressErrorWindow: true,
    method: 'identity.check',
    params: {}
});
