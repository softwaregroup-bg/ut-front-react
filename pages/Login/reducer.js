import {actionList} from './actions';
import Immutable from 'immutable';
const defaultLoginState = Immutable.fromJS({
    authenticated: false,
    changeId: 0,
    loginResultId: 0,
    logOutResultId: 0,
    cookieCheckResultId: 0
});

const defaultLoginDataState = Immutable.fromJS({
    changeId: 0,
    data: {}
});

export const login = (state = defaultLoginState, action) => {
    switch (action.type) {
        case actionList.LOGOUT:
            if (action.methodRequestState === 'finished') {
                return defaultLoginState.update('logOutResultId', (v) => (v + 1));
            }
            return state;
        case actionList.LOGIN:
            state = state
                .set('reqState', action.methodRequestState);
            if (action.methodRequestState === 'finished') {
                if (action.error && (~action.error.type.indexOf('.param.') || ~action.error.type.indexOf('.term.'))) {
                    return state
                        .set('loginCourse', Immutable.Map({message: action.error.message, type: Immutable.List(action.error.type.split('.'))}))
                        .set('cookieCheckResultId', 0)
                        .update('loginResultId', (v) => (v + 1))
                        .set('authenticated', false);
                } else if (action.error) {
                    return state
                        .set('error', Immutable.fromJS({code: action.error.code, message: action.error.message, type: action.error.type}))
                        .update('loginResultId', (v) => (v + 1))
                        .set('cookieCheckResultId', 0)
                        .set('authenticated', false);
                } else if (action.result) {
                    return state
                        .delete('error')
                        .delete('loginCourse')
                        .set('cookieCheckResultId', 0)
                        .update('loginResultId', (v) => (v + 1))
                        .set('authenticated', true);
                }
            }
            break;
        case actionList.COOKIE_CHECK:
            state = state.set('reqState', action.methodRequestState);
            if (action.methodRequestState === 'finished') {
                if (action.error) {
                    return state
                        .set('error', Immutable.fromJS({code: action.error.code, message: action.error.message, type: action.error.type}))
                        .delete('result')
                        .update('cookieCheckResultId', (v) => (v + 1))
                        .delete('loginResultId')
                        .set('authenticated', false);
                } else if (action.result) {
                    return state
                        .set('result', Immutable.fromJS(action.result))
                        .update('cookieCheckResultId', (v) => (v + 1))
                        .delete('loginResultId')
                        .set('authenticated', true);
                }
            }
            return state;
        default:
            return state.set('authenticated', false);
    }
    return state;
};

export const loginData = (state = defaultLoginDataState, action) => {
    switch (action.type) {
        case actionList.LOGIN_DATA:
            action.data.map((chunk) => {
                state = state
                    .setIn(['data', chunk.key], chunk.value)
                    .update('changeId', (v) => (v + 1));
            });
            return state;
        default:
            return state;
    }
};
