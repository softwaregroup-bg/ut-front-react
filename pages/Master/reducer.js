import {actions} from './actions';
import immutable from 'immutable';

import { actionList } from '../Login/actions';
import { LOGIN } from '../../containers/LoginForm/actionTypes';

const defaultPreloadWindowState = immutable.fromJS({
    open: false,
    requests: 0,
    message: 'Loading, please wait...'
});
const defaultErrorWindowState = immutable.fromJS({
    open: false,
    message: '',
    type: null,
    title: null,
    print: null,
    params: null
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
        const requests = state.get('requests');
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
            return defaultErrorWindowState;
        }
        if (action.type === actions.ERROR_WINDOW_TOGGLE) {
            const message = (mapErrorMessage(action.message) || mapErrorMessage(state.get('message')));
            return state
                .set('open', !state.get('open'))
                .delete('title')
                .set('message', message)
                .delete('type')
                .delete('print')
                .delete('params');
        }
        if (action.error) {
            const msg = (mapErrorMessage(action.error) || mapErrorMessage(state.get('message')));
            const statusMessage = action.error.statusMessage;
            const statusCode = action.error.statusCode;
            let title = 'Error';
            const type = action.error.type;
            if (statusMessage) {
                title = `${statusMessage}`;
                if (statusCode) {
                    title += `(${statusCode})`;
                }
            }

            const { print, params } = action.error;
            if (print) {
                state = state.set('print', print);
            }
            if (params) {
                state = state.set('params', params);
            }

            return state
                .set('open', true)
                .set('title', title)
                .set('message', msg)
                .set('type', type);
        }
    }

    if ((action.type === actionList.LOGIN || action.type === LOGIN) && action.methodRequestState === 'finished' && action.result) {
        return state
            .set('open', false)
            .delete('title')
            .set('message', '')
            .delete('type')
            .delete('print')
            .delete('params');
    }
    return state;
};

const mapErrorMessage = (resp) => {
    let returnMsg = resp.message;
    if (resp.validation && resp.validation.keys && resp.validation.keys.length > 0) {
        returnMsg = resp.validation.keys.reduce((prev, cur) => {
            prev.push(cur);
            return prev;
        }, ['Validation error in:']);
        return returnMsg.join(' ');
    }
    return returnMsg;
};

export default {errorWindow, preloadWindow};
