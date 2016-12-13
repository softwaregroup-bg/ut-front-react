import dateFormat from 'date-fns/format';

let checkPermission = () => {
    return false;
};

export const setPermissions = (permissions) => {
    let cache = {};
    let regExp = new RegExp(permissions.map(function(permission) {
        return ['^', permission.actionId.replace('%', '(.+?)'), '$'].join('');
    }).join('|'));

    checkPermission = function(action) {
        if (cache[action] === undefined) {
            cache[action] = regExp.test(action);
        }
        return cache[action];
    };
};

export const translate = (props) => (text, language) => {
    if (!props.gate.texts || !props.gate.texts[text]) {
        return text;
    }

    return props.gate.texts[text];
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
        format = props.login.result && props.login.result.localisation.dateFormat || 'YYYY-MM-DD';
    }

    return dateFormat(new Date(date), format);
};

// TODO: check and refactor
export const numberFormat = (props) => (num, format) => {
    let parts = [];

    if (!format) {
        format = props.login.result && props.login.result.localisation.numberFormat || '2|.|';
    }

    parts = format.split('|');

    if(parts.length !== 3 ) {
        return num;
    }

    num = parseInt(num).toFixed(parseInt(parts[0]));

    if (parts[1]){
        num = num.toString().replace('.', parts[1]);
    }

    return num.toString().replace(/\B(?=(\d{3})+\b)/g, parts[2]);
};
