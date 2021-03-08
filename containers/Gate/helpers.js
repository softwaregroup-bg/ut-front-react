import dateFormat from 'date-fns/format';

let permissionsCache = {};
let permissionsRegExp = false;

export const checkPermission = (actions) => {
    if (!Array.isArray(actions)) {
        actions = [actions];
    }

    actions.forEach((action) => {
        if (!permissionsCache[action]) {
            permissionsCache[action] = permissionsRegExp && permissionsRegExp.test(action);
        }
    });

    let foundPermissions = 0;
    for (let i = 0; i < actions.length; i += 1) {
        if (permissionsCache[actions[i]]) {
            foundPermissions++;
        }
    }
    return foundPermissions === actions.length;
};

export const setPermissions = (permissions) => {
    permissionsCache = {};
    permissionsRegExp = new RegExp(permissions.map(function(permission) {
        return ['^', permission.actionId.replace('%', '(.+?)'), '$'].join('');
    }).join('|'));
};

export const translate = (props) => (text, language) => {
    const texts = props.gate.get('texts');

    if (!texts || !texts.get(text)) {
        return text;
    }

    return texts.get(text);
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
        format = props.login.get('result') && props.login.result.getIn(['localisation', 'dateFormat']) ? props.login.result.getIn(['localisation', 'dateFormat']) : 'yyyy-MM-dd';
    }

    return dateFormat(new Date(date), format);
};

export const numberFormat = (props) => (num, format) => {
    let parts = [];

    if (!format) {
        format = props.login.get('result') && props.login.getIn(['result', 'localisation', 'numberFormat']) ? props.login.getIn(['result', 'localisation', 'numberFormat']) : '2|.|';
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
