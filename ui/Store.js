import { combineReducers, createStore, compose, applyMiddleware } from 'redux';

const resetStore = (reducer, resetAction) => {
    return (state, action) => {
        if (action.type) {
            switch (action.type) {
                case resetAction:
                    return reducer({}, action);
            }
        }
        return reducer(state, action);
    };
};
const devToolsExtension = window.devToolsExtension || window.__REDUX_DEVTOOLS_EXTENSION__;
const enhancer = compose(
    ((typeof window !== 'undefined') && devToolsExtension)
        ? devToolsExtension({
            serialize: true,
            actionSanitizer: (action) => {
                if (typeof action.type === 'symbol') {
                    const actionCopy = {...action}; // Don't change the original action
                    actionCopy.type = action.type.toString(); // DevTools doesn't work with Symbols
                    return actionCopy;
                }
                return action;
            }
        })
        : f => f
);

export function Store(reducers, resetAction, middlewares) {
    const mixedReducers = combineReducers(reducers);
    const store = applyMiddleware(...middlewares)(createStore);
    return store(resetStore(mixedReducers, resetAction), {}, enhancer);
};
