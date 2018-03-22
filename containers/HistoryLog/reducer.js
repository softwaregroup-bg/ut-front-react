
import * as actionTypes from './actionTypes';
import { REMOVE_TAB } from 'ut-front-react/containers/TabMenu/actionTypes';
import * as reducerHelper from './reducerHelper';
import { defaultState } from './defaultState';
import { fromJS } from 'immutable';
const historyContainer = (state = fromJS(defaultState), action) => {
    let options = state.get('config').toJS();
    switch (action.type) {
        case actionTypes.CHANGE_HISTORY_PROFILE:
            return reducerHelper.changeHistoryProfile(state, action, options);
        case actionTypes.FETCH_HISTORIES:
            return reducerHelper.fetchHistories(state, action, options);
        case actionTypes.UPDATE_FILTER_ERRORS:
            return reducerHelper.updateFilterErrors(state, action, options);
        case actionTypes.REFETCH_HISTORIES:
            return reducerHelper.refetchHistories(state, action, options);
        case actionTypes.SELECT_HISTORY:
            return reducerHelper.selectHistory(state, action, options);
        case actionTypes.CHECK_HISTORIES:
            return reducerHelper.checkHistories(state, action, options);
        case actionTypes.UPDATE_HISTORY_GRID_PAGINATION:
            return reducerHelper.updateGridPagination(state, action, options);
        case actionTypes.CHANGE_HISTORY_GRID_SORTORDER:
            return reducerHelper.changeHistoryGridOrder(state, action, options);
        case actionTypes.CHANGE_HISTORY_FILTER:
            return reducerHelper.changeHistoryFilter(state, action, options);
        case actionTypes.CLEAR_HISTORY_FILTER:
            return reducerHelper.clearHistoryFilter(state, action, options);
        case actionTypes.TOGGLE_HISTORY_FILTER:
            return reducerHelper.toggleHistoryFilter(state, action, options);
        case actionTypes.GET_EVENT_DETAILS:
            return reducerHelper.getEventDetails(state, action, options);
        case REMOVE_TAB:
            return reducerHelper.onTabRemove(state, action, options);
        default:
            return state;
    }
};

export default historyContainer;
