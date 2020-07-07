import Immutable from 'immutable';
import {
    LOGIN,
    BIO_LOGIN,
    SET_INPUT_VALUE,
    VALIDATE_FORM,
    COOKIE_CHECK,
    LOGOUT,
    CLEAR_LOGIN_STATE,
    SET_GATE_LOAD
} from './actionTypes';
import { inputs as inputsConfig, loginSteps } from './config';
import { Validator } from './../../utils/validator';
import { loginReducerProxy, prePopulate } from './storeProxy/loginReducerProxy';

const validator = new Validator(inputsConfig);

const updateLoginStep = (state, step) => {
    const loginStep = loginSteps[step];
    const currentInputs = state.getIn(['loginForm', 'inputs']);
    let newInputs = Immutable.Map();

    Object.keys(loginStep.inputs).forEach(input => {
        const inputValue = state.getIn(['loginForm', 'inputs', input, 'value']);
        // if the form already has this input, perserve its value only and reset its cofig
        const newInput = currentInputs.has(input) ? Object.assign({}, loginStep.inputs[input], { value: inputValue }) : loginStep.inputs[input];
        newInputs = newInputs.set(input, Immutable.fromJS(newInput));
    });

    state = state.setIn(['loginForm', 'inputs'], newInputs);

    loginStep.disabledFields.forEach(field => {
        state = state.setIn(['loginForm', 'inputs', field, 'disabled'], true);
    });

    return state.setIn(['loginForm', 'buttonLabel'], loginStep.buttonLabel)
        .setIn(['loginForm', 'title'], loginStep.title)
        .set('formError', '')
        .set('loginType', step);
};

const defaultLoginState = Immutable.fromJS({
    authenticated: false,
    cookieChecked: false,
    isLogout: false,
    loginForm: loginSteps.initial,
    loginType: '',
    formError: '',
    shouldSubmit: false,
    loginData: {}
});

const loginReducer = (state = defaultLoginState, action) => {
    let validationResult;

    switch (action.type) {
        case LOGOUT:
            return defaultLoginState
                .set('isLogout', true);
        case LOGIN:
            if (action.methodRequestState === 'finished') {
                state = state.setIn(['loginForm', 'shouldSubmit'], false);

                if (action.error) {
                    const err = action.error.type.split('.');
                    const type = err[err.length - 1];

                    return loginSteps[type] ? updateLoginStep(state, type) : state.set('formError', action.error.message);
                } else if (action.result) {
                    return state.set('result', Immutable.fromJS(action.result))
                        .set('authenticated', true)
                        .set('cookieChecked', true)
                        .set('formError', '');
                }
            }
            return state;
        case BIO_LOGIN:
            return state;
        case SET_INPUT_VALUE:
            return state.setIn(['loginForm', 'inputs', action.input, 'value'], action.value);
        case VALIDATE_FORM: {
            validationResult = validator.validateAll(state.getIn(['loginForm', 'inputs']));

            const getLoginData = () => {
                const inputs = state.getIn(['loginForm', 'inputs']);
                let currentLoginData = state.get('loginData');
                inputs.toSeq().forEach(input => {
                    if (!input.get('skipSubmit')) {
                        currentLoginData = currentLoginData.set(input.get('name'), input.get('value'));
                    }
                });
                return currentLoginData;
            };

            if (validationResult.isValid) {
                const prevInvalidField = state.getIn(['loginForm', 'inputs']).find(input => input.get('error'));

                if (prevInvalidField) {
                    state = state.setIn(['loginForm', 'inputs', prevInvalidField.get('name'), 'error'], '');
                }

                state = state.set('loginData', getLoginData());
            } else {
                state = state.setIn(['loginForm', 'inputs', validationResult.invalidField, 'error'], validationResult.error)
                    .set('formError', '');
            }

            return state.setIn(['loginForm', 'shouldSubmit'], validationResult.isValid);
        }
        case COOKIE_CHECK:
            if (action.methodRequestState === 'finished') {
                if (action.error) {
                    return state.delete('result')
                        .set('cookieChecked', true)
                        .set('authenticated', false);
                } else if (action.result) {
                    return state.set('result', Immutable.fromJS(action.result))
                        .set('cookieChecked', true)
                        .set('authenticated', true)
                        .set('fromGate', action.fromGate);
                }
            }
            return state;
        case CLEAR_LOGIN_STATE:
            return defaultLoginState;
        case SET_GATE_LOAD:
            return state.set('gateLoaded', action.params.value);
        default:
            return state;
    }
};

export const login = (state, action) => {
    const prePopulatedState = prePopulate(state, action);
    const newState = loginReducer(prePopulatedState, action);
    return loginReducerProxy(newState, action);
};
