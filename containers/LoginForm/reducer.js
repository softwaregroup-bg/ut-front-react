import Immutable from 'immutable';
import {
    LOGIN,
    BIO_LOGIN,
    SET_INPUT_VALUE,
    VALIDATE_FORM,
    COOKIE_CHECK,
    LOGOUT,
    CLEAR_LOGIN_STATE,
    RESET_FORGOTTEN_PASSWORD,
    CHANGE_LOGIN_TYPE
} from './actionTypes';
import { inputs as inputsConfig, loginSteps } from './config';
import { Validator } from './../../utils/validator';
import { loginReducerProxy, prePopulate } from './storeProxy/loginReducerProxy';

const validator = new Validator(inputsConfig);

const updateLoginStep = (state, step) => {
    let loginStep = loginSteps[step];
    let currentInputs = state.getIn(['loginForm', 'inputs']);
    let newInputs = Immutable.Map();

    Object.keys(loginStep.inputs).forEach(input => {
        let inputValue = state.getIn(['loginForm', 'inputs', input, 'value']);
        // if the form already has this input, perserve its value only and reset its cofig
        let newInput = currentInputs.has(input) ? Object.assign({}, loginStep.inputs[input], { value: inputValue }) : loginStep.inputs[input];
        newInputs = newInputs.set(input, Immutable.fromJS(newInput));
    });

    state = state.setIn(['loginForm', 'inputs'], newInputs);

    loginStep.disabledFields && loginStep.disabledFields.forEach(field => {
        state = state.setIn(['loginForm', 'inputs', field, 'disabled'], true);
    });

    return state.setIn(['loginForm', 'buttonLabel'], loginStep.buttonLabel)
                .setIn(['loginForm', 'title'], loginStep.title)
                .set('formError', '')
                .set('formMessage', '')
                .set('loginType', step);
};

const defaultLoginState = Immutable.fromJS({
    authenticated: false,
    cookieChecked: false,
    loginForm: loginSteps['initial'],
    loginType: '',
    formError: '',
    formMessage: '',
    shouldSubmit: false,
    loginData: {}
});

const loginReducer = (state = defaultLoginState, action) => {
    let validationResult;

    switch (action.type) {
        case LOGOUT:
            return defaultLoginState;
        case LOGIN:
            if (action.methodRequestState === 'finished') {
                state = state.setIn(['loginForm', 'shouldSubmit'], false);

                if (action.error) {
                    let err = action.error.type.split('.');
                    let type = err[err.length - 1];

                    return loginSteps[type] ? updateLoginStep(state, type) : state.set('formError', action.error.message);
                } else if (action.result) {
                    return state.set('authenticated', true)
                                .set('cookieChecked', true)
                                .set('formError', '');
                }
            }
            return state;
        case BIO_LOGIN:
            return state;
        case SET_INPUT_VALUE:
            return state.setIn(['loginForm', 'inputs', action.input, 'value'], action.value);
        case VALIDATE_FORM:
            validationResult = validator.validateAll(state.getIn(['loginForm', 'inputs']));

            const getLoginData = () => {
                let inputs = state.getIn(['loginForm', 'inputs']);
                let currentLoginData = state.get('loginData');
                inputs.toSeq().forEach(input => {
                    if (!input.get('skipSubmit')) {
                        currentLoginData = currentLoginData.set(input.get('name'), input.get('value'));
                    }
                });
                return currentLoginData;
            };

            if (validationResult.isValid) {
                let prevInvalidField = state.getIn(['loginForm', 'inputs']).find(input => input.get('error'));

                if (prevInvalidField) {
                    state = state.setIn(['loginForm', 'inputs', prevInvalidField.get('name'), 'error'], '');
                }

                state = state.set('loginData', getLoginData());
            } else {
                state = state.setIn(['loginForm', 'inputs', validationResult.invalidField, 'error'], validationResult.error)
                              .set('formError', '');
            }

            return state.setIn(['loginForm', 'shouldSubmit'], validationResult.isValid);

        case COOKIE_CHECK:
            if (action.methodRequestState === 'finished') {
                if (action.error) {
                    return state.delete('result')
                                .set('cookieChecked', true)
                                .set('authenticated', false);
                } else if (action.result) {
                    return state.set('result', Immutable.fromJS(action.result))
                                .set('cookieChecked', true)
                                .set('authenticated', true);
                }
            }
            return state;
        case CHANGE_LOGIN_TYPE:
            return updateLoginStep(state, action.params.loginType);
        case RESET_FORGOTTEN_PASSWORD:
            if (action.methodRequestState === 'finished') {
                if (action.error) {
                    return state.set('formError', action.error.errorPrint || action.error.message);
                } else if (action.result) {
                    if (action.result.forgottenResetPassword) {
                        return defaultLoginState;
                    } else if (action.result.otpSentByEmail || action.result.otpSentBySms) {
                        state = updateLoginStep(state, 'forgottenPasswordReset');
                        let channels = [];
                        if (action.result.otpSentByEmail) {
                            channels.push('email');
                        }
                        if (action.result.otpSentBySms) {
                            channels.push('sms');
                        }
                        return state.set('formMessage', `OTP has sent to your ${channels.join(' and ')}`);
                    }
                    return state;
                }
            }
            return state;
        case CLEAR_LOGIN_STATE:
            return defaultLoginState;
        default:
            return state;
    }
};

export const login = (state, action) => {
    const prePopulatedState = prePopulate(state, action);
    const newState = loginReducer(prePopulatedState, action);
    return loginReducerProxy(newState, action);
};
