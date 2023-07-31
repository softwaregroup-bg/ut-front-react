import dateFormat from 'date-fns/format';

export const objectHasProps = (object) => {
    for (const prop in object) {
        if (Object.prototype.hasOwnProperty.call(object, prop)) {
            return true;
        }
    }

    return false;
};

/**
 * @param {arr1} [] First array to compare
 * @param {arr2} [] Second array to compare
 * @param {props} [] String - object props
 * Uses a propMapper which holds for each prop number.
 * First, iterates over the first array and increments the number for each prop.
 * Then it iterates over the second array and decrements the number.
 * In the end checks if propMapper has only 0 for each prop.
 *
 * Return if two arrays of object have the SAME LENGTH and each object in them have equal value for props
 */
export function compareArrayOfObject(arr1, arr2, props) {
    if (!Array.isArray(props) && typeof props === 'string') {
        props = [props];
    } else {
        return false;
    }

    const result = true;

    if (arr1.length !== arr2.length) {
        return false;
    }

    const propMapper = {};
    props.forEach((prop) => {
        propMapper[prop] = {};
    });

    for (let i = 0; i < arr1.length; i += 1) {
        const arr1Object = arr1[i];

        props.forEach((prop) => {
            const arr1ObjectValue = arr1Object[prop];
            if (!propMapper[prop][arr1ObjectValue]) {
                propMapper[prop][arr1ObjectValue] = 0;
            }
            propMapper[prop][arr1ObjectValue] += 1;
        });
    }

    for (let i = 0; i < arr2.length; i += 1) {
        const arr2Object = arr2[i];

        props.forEach((prop) => {
            const arr2ObjectValue = arr2Object[prop];
            if (propMapper[prop][arr2ObjectValue]) {
                propMapper[prop][arr2ObjectValue] -= 1;
            }
        });
    }

    for (const prop in propMapper) {
        const currentProp = propMapper[prop];
        for (const number in currentProp) {
            if (currentProp[number] !== 0) {
                return false;
            }
        }
    }

    return result;
}

export const translate = (props) => (text, language) => {
    return props.gate.getIn(['texts', text]) || text;
};

export const money = (amount, currency, locale) => {
    if (!currency) currency = 'EUR';
    if (!locale) locale = 'en-UK';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2
    }).format(amount);
};

export const numberFormat = (props) => (num, format) => {
    if (!format) {
        format = props.login.get('result') && props.login.getIn(['result', 'localisation', 'numberFormat']) ? props.login.getIn(['result', 'localisation', 'numberFormat']) : '2|.|';
    }
    const parts = format.split('|');
    if (parts.length !== 3) return num;
    num = parseInt(num).toFixed(parseInt(parts[0]));
    if (parts[1]) num = num.toString().replace('.', parts[1]);
    num = num.toString().replace(/\B(?=(\d{3})+\b)/g, parts[2]);
    return num;
};

export const df = (props) => (date, format) => {
    if (!format) {
        format = props.login.get('result') && props.login.getIn(['result', 'localisation', 'dateFormat']) ? props.login.getIn(['result', 'localisation', 'dateFormat']) : 'yyyy-MM-dd';
    }
    return dateFormat(new Date(date), format);
};

export const dateDisplayFormat = (date, format) => {
    return dateFormat(new Date(date), 'yyyy-MM-dd');
};

export let checkPermission = function() {
    return false;
};

export const setPermissions = function(permissions) {
    const cache = {};
    const regExp = new RegExp(permissions.map(function(permission) {
        return ['^', permission.actionId.replace('%', '(.+?)'), '$'].join('');
    }).join('|'));
    checkPermission = function(action) {
        if (cache[action] === undefined) {
            cache[action] = regExp.test(action);
        }
        return cache[action];
    };
};

export const calculateAspectRatio = (file, scaleDimensions) => {
    const img = document.createElement('img');
    img.src = file;

    if (img.width === 0 && img.height === 0) {
        // when image url is passed width and height can not be calculated
        return {
            width: scaleDimensions.width,
            height: scaleDimensions.height
        };
    } else {
        // cases when base64 data is passed
        const ratio = Math.min(scaleDimensions.width / img.width, scaleDimensions.height / img.height);
        return {
            width: img.width * ratio,
            height: img.height * ratio
        };
    }
};

export const uppercaseFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
