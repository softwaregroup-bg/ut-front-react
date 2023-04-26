import { inputs as possibleFormInputs } from '../config';
import * as actionTypes from '../actionTypes';

const loginActions = Object.keys(actionTypes).map(actionKey => actionTypes[actionKey]);

export const loginFormPaths = Object.keys(possibleFormInputs).reduce((prev, curr) => {
    prev.push(['loginForm', 'inputs', curr, 'value']);
    return prev;
}, []);

export const loginDataPaths = Object.keys(possibleFormInputs).reduce((prev, curr) => {
    prev.push(['loginData', curr]);
    return prev;
}, []);

export const actionIsForLogin = actionType => {
    return (loginActions.indexOf(actionType) >= 0);
};

// import { inputs as possibleFormInputs } from '../config';
// import * as actionTypes from '../actionTypes';

// const loginActions = Object.keys(actionTypes).map(actionKey => actionTypes[actionKey]);

// export const loginFormPaths = Object.keys(possibleFormInputs).reduce((prev, curr) => {
//     prev.push(['loginForm', 'inputs', curr, 'value']);
//     return prev;
// }, []);

// export const loginDataPaths = Object.keys(possibleFormInputs).reduce((prev, curr) => {
//     prev.push(['loginData', curr]);
//     return prev;
// }, []);

// export const actionIsForLogin = actionType => (loginActions.indexOf(actionType) >= 0);
