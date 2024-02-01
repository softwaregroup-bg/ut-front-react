import classnames from 'classnames';

export const getClass = (styles, className) => className && classnames(className.split(' ').map(name => styles[name]));

export const breakOnSpaceChars = (str) => str.split('\\n');

export const capitalizeFirstLetter = (string = '') => string !== null ? string.charAt(0).toUpperCase() + string.slice(1) : '';

export const generateUniqueId = () => `${Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)}_${Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)}`;

const toObject = (val) => val === null || val === undefined ? {} : Object(val);

export function deepAssign(target) {
    target = JSON.parse(JSON.stringify(toObject(target)));

    for (let i = 1; i < arguments.length; i++) {
        assign(target, arguments[i]);
    }
    return target;
};

const isObject = (value) => value !== null && (typeof value === 'object' || typeof value === 'function');

const assignKey = (to, from, key) => {
    const val = from[key];

    if (val === undefined || val === null) {
        return;
    }

    if (Object.prototype.hasOwnProperty.call(to, key)) {
        if (to[key] === undefined || to[key] === null) {
            return;
        }
    }

    if (!Object.prototype.hasOwnProperty.call(to, key) || !isObject(val)) {
        to[key] = val;
    } else {
        to[key] = assign(Object(to[key]), from[key]);
    }
};

const assign = (to, from) => {
    if (to === from) {
        return to;
    }

    from = toObject(from);

    for (const key in from) {
        if (Object.prototype.hasOwnProperty.call(from, key)) {
            assignKey(to, from, key);
        }
    }

    if (Object.getOwnPropertySymbols) {
        const symbols = Object.getOwnPropertySymbols(from);

        for (let i = 0; i < symbols.length; i++) {
            if (Object.prototype.propertyIsEnumerable.call(from, symbols[i])) {
                assignKey(to, from, symbols[i]);
            }
        }
    }
    return to;
};

export const capitalizeEveryWord = (string) => string.split(' ').map((word) => capitalizeFirstLetter(word)).join(' ');
