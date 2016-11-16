import { createStore } from 'redux';
// import { combineReducers } from 'redux';
var store;

export default () => {
    if (!store) {
        // store = createStore(combineReducers({
        //     test(state, action) {
        //         return Object.assign({}, state);
        //     }
        // }));
        store = createStore(function(state, initialState) { return state; });
    }

    return store;
};
