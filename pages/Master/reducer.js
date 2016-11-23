import {actions} from './actions';
import immutable from 'immutable';

const defaultPreloadWindowState = immutable.fromJS({
    open: false,
    requests: 0,
    message: 'Fetching content from backend, please wait!'
});
const defaultErrorWindowState = immutable.fromJS({
    open: false,
    message: ''
});

export const preloadWindow = (state = defaultPreloadWindowState, action) => {
    if (action.suppressPreloadWindow) {
        return state;
    }
    let message = defaultPreloadWindowState.get('message');
    if (action.prefetchWindowText) {
        message = action.prefetchWindowText;
    }

    if (action.methodRequestState === 'requested') {
        return state
            .set('open', true)
            .set('requests', state.get('requests') + 1)
            .delete('title')
            .set('message', message);
    } else if (action.methodRequestState === 'finished') {
        let requests = state.get('requests');
        if (requests - 1 === 0 || requests - 1 < 0) {
            return state
                .set('open', false)
                .set('requests', 0)
                .delete('title')
                .set('message', message);
        } else {
            return state
                .set('requests', state.get('requests') - 1)
                .delete('title')
                .set('message', message);
        }
    }
    if (action.type === actions.PREFETCH_WINDOW_CLOSE) {
        return state
            .delete('title')
            .set('open', false);
    }
    return state
        .delete('title')
        .set('message', message);
};

export const errorWindow = (state = defaultErrorWindowState, action) => {
    if (!action.suppressErrorWindow) {
        if (action.type === actions.ERROR_WINDOW_CLOSE) {
            return state
                .set('open', false)
                .delete('title')
                .set('message', '');
        }
        if (action.type === actions.ERROR_WINDOW_TOGGLE) {
            let message = (mapErrorMessage(action.message) || mapErrorMessage(state.get('message')));
            return state
                .set('open', !state.get('open'))
                .delete('title')
                .set('message', message);
        }
        if (action.error) {
            let msg = (mapErrorMessage(action.error) || mapErrorMessage(state.get('message')));
            return state
                .set('open', true)
                .set('title', `${action.error.statusMessage}(${action.error.statusCode})`)
                .set('message', msg);
        }
    }
    return state;
};

const mapErrorMessage = (resp) => {
    var returnMsg = resp.message;
    if (resp.validation) {
        returnMsg = resp.validation.keys.reduce((prev, cur) => {
            prev.push(cur);
            return prev;
        }, ['Validation error in:']);
        return returnMsg.join(' ');
    }
    return returnMsg;
};

export default {errorWindow, preloadWindow};
