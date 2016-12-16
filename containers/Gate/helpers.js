import dateFormat from 'date-fns/format';

let permissionsCache = {};
let permissionsRegExp = [];

export const checkPermission = (action) => {
    if (!permissionsCache[action]) {
        permissionsCache[action] = permissionsRegExp.test(action);
    }

    return permissionsCache[action];
};

export const setPermissions = (permissions) => {
    permissionsRegExp = new RegExp(permissions.map(function(permission) {
        return ['^', permission.actionId.replace('%', '(.+?)'), '$'].join('');
    }).join('|'));
};

export const translate = (props) => (text, language) => {
    let texts = props.gate.get('texts');

    if (!texts|| !texts[text]) {
        return text;
    }

    return texts[text];
};

export const money = (amount, currency = 'EUR', locale = 'en-UK') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(amount);
};

export const df = (props) => (date, format) => {
    if (!format) {
        format = props.login.get('result') && props.login.result.getIn(['localisation', 'dateFormat']) || 'YYYY-MM-DD';
    }

    return dateFormat(new Date(date), format);
};

export const numberFormat = (props) => (num, format) => {
    let parts = [];

    if (!format) {
        format = props.login.get('result') && props.login.getIn(['result', 'localisation', 'numberFormat']) || '2|.|';
    }

    parts = format.split('|');

    if (parts.length !== 3) {
        return num;
    }

    num = parseInt(num).toFixed(parseInt(parts[0]));

    if (parts[1]) {
        num = num.toString().replace('.', parts[1]);
    }

    return num.toString().replace(/\B(?=(\d{3})+\b)/g, parts[2]);
};
