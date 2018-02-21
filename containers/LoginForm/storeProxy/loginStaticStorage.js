import immutable from 'immutable';
import { inputs as possibleInputs } from '../config';

// To whoever encouters this.
// This is a temporary solution that removes credentials from the redux store.

const inputs = Object.keys(possibleInputs).reduce((prev, curr) => {
    return Object.assign(prev, { [curr]: { value: '' } });
}, {});

const loginData = Object.keys(possibleInputs).reduce((prev, curr) => {
    return Object.assign(prev, { [curr]: '' });
}, {});

const defaultLoginStaticStorage = {
    loginForm: {
        inputs
    },
    loginData
};

let loginForm = immutable.fromJS(defaultLoginStaticStorage);

export const resetLoginStaticStorage = () => {
    loginForm = immutable.fromJS(defaultLoginStaticStorage);
};

export const getLoginStaticStorage = () => loginForm;

export const setLoginStaticStorage = newLoginForm => {
    loginForm = newLoginForm;
};
