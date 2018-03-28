import { fromJS } from 'immutable';
import { defaultHistoryState, defaultState } from './defaultState';
import {intersectChecked, removeChecked} from './helpers';
const FINISHED = 'finished';

function getPathVariable(pathname) {
    return pathname.replace(/#/, '').split('/').filter((p) => !!p).join('_');
};

export function changeHistoryProfile(state, action, options) {
    let newObjectId = action.params.objectId;
    let newObjectName = action.params.objectName;
    return state.set('config', fromJS({objectId: newObjectId, objectName: newObjectName}))
        .setIn([newObjectName, newObjectId], state.getIn([newObjectName, newObjectId]) || fromJS(defaultHistoryState))
        .setIn(['visitedHistoryPaths', getPathVariable(window.location.hash)], fromJS({objectId: newObjectId, objectName: newObjectName}));
};

export function fetchHistories(state, action, options) {
    let { objectName, objectId } = options;
    if (action.methodRequestState === FINISHED && !action.error && action.result.history) {
        var histories = action.result.history && action.result.history.map(function(record) {
            record.actorId = record.globalId;
            record._version = record.version;
            return record;
        });
        var pagination = action.result.pagination && action.result.pagination.length ? action.result.pagination[0] : defaultHistoryState.pagination;
        pagination.pagesTotal = parseInt(pagination.pagesTotal);
        pagination.recordsTotal = parseInt(pagination.recordsTotal);
        if (pagination.pageNumber === 1 && histories[0]) { // records are fetched in dec order only
            histories[0]._version = 'Current ' + histories[0].version;
        }
        return state.setIn([objectName, objectId, 'filterChanged'], false)
            .setIn([objectName, objectId, 'pagination'], fromJS(pagination))
            .setIn([objectName, objectId, 'checkedHistories'], fromJS([]))
            .setIn([objectName, objectId, 'histories'], fromJS(histories));
    }
    return state;
};

export function updateFilterErrors(state, action, options) {
    let { objectName, objectId } = options;
    if (action.params.key) {
        return state.setIn([objectName, objectId, 'errors'].concat(action.params.key.split(',')), action.params.value);
    } else {
        return state.setIn([objectName, objectId, 'errors'], fromJS({})).set('filterChanged', false);
    }
}

export function refetchHistories(state, action, options) {
    let { objectName, objectId } = options;
    return state.setIn([objectName, objectId, 'filterChanged'], true);
};

export function selectHistory(state, action, options) {
    let { objectName, objectId } = options;
    let checked;
    let current = fromJS([action.params.history]);
    var chs = state.getIn([objectName, objectId, 'checkedHistories']);
    state = state.setIn([objectName, objectId, 'showFilter'], false)
        .setIn([objectName, objectId, 'selectedHistory'], action.params.isSelected ? fromJS(action.params.history) : null);

    if (action.params.isSelected && chs.size === 0) {
        checked = intersectChecked(chs, fromJS(current)); // check record if none is selected
    } else if (action.params.isSelected && chs.size === 1) {
        checked = intersectChecked(fromJS([]), fromJS(current)); // toggle checked record if only one is selected
    } else if (!action.params.isSelected && chs.size === 1) {
        checked = fromJS([]);
    }
    if (checked) {
        state = state.setIn([objectName, objectId, 'checkedHistories'], checked);
    }
    return state;
};

export function checkHistories(state, action, options) {
    let { objectName, objectId } = options;
    let newChecked;
    if (action.params.checked) {
        newChecked = intersectChecked(state.getIn([objectName, objectId, 'checkedHistories']), action.params.histories);
    } else {
        newChecked = removeChecked(state.getIn([objectName, objectId, 'checkedHistories']), action.params.histories);
    }
    return state
        .setIn([objectName, objectId, 'showFilter'], newChecked.size > 0 ? !1 : !0)
        .setIn([objectName, objectId, 'checkedHistories'], newChecked);
};

export function updateGridPagination(state, action, options) {
    let { objectName, objectId } = options;
    return state.setIn([objectName, objectId, 'filterChanged'], true)
                .setIn([objectName, objectId, 'pagination'], action.params);
}

export function changeHistoryGridOrder(state, action, options) {
    let { objectName, objectId } = options;
    return state.setIn([objectName, objectId, 'filterChanged'], true)
                .setIn([objectName, objectId, 'filters', 'sortBy'], action.params.column)
                .setIn([objectName, objectId, 'filters', 'sortOrder'], action.params.direction);
}

export function changeHistoryFilter(state, action, options) {
    let { objectName, objectId } = options;
    if (action.params.error && action.params.value) {
        return state.setIn([objectName, objectId, 'filterErrors', action.params.key], action.params.errorMessage)
        .setIn([objectName, objectId, 'filters', action.params.key], action.params.value);
    } else {
        if (!action.params.value) {
            state = state.deleteIn([objectName, objectId, 'filters', action.params.key])
                .deleteIn([objectName, objectId, 'filterErrors', action.params.key]);
        } else {
            state = state.setIn([objectName, objectId, 'filters', action.params.key], action.params.value)
                .deleteIn([objectName, objectId, 'filterErrors', action.params.key]);
        }
        if (action.params.requireFetch !== undefined) {
            state = state.setIn([objectName, objectId, 'filterChanged'], action.params.requireFetch);
        } else {
            state = state.setIn([objectName, objectId, 'filterChanged'], true);
        }
    }
    return state; // .setIn([objectName, objectId, 'pagination'], fromJS(defaultHistoryState.pagination));
}

export function clearHistoryFilter(state, action, options) {
    let { objectName, objectId } = options;
    return state
        .setIn([objectName, objectId, 'pagination'], fromJS(defaultHistoryState.pagination))
        .setIn([objectName, objectId, 'filterErrors'], fromJS({}))
        .setIn([objectName, objectId, 'filters'], fromJS({}))
        .setIn([objectName, objectId, 'filterChanged'], true);
}

export function toggleHistoryFilter(state, action, options) {
    let { objectName, objectId } = options;
    return state.setIn([objectName, objectId, 'showFilter'], !state.getIn([objectName, objectId, 'showFilter']));
}

export function getEventDetails(state, action, options) {
    let { objectName, objectId } = options;
    if (action.methodRequestState === FINISHED && !action.error) {
        state = state.setIn([objectName, objectId, 'eventDetails'], fromJS(action.result.auditLog || {}));
    }
    return state;
}

export function onTabRemove(state, action, options) {
    let { objectId } = options;
    let pathKey = getPathVariable(action.pathname);
    let visitedObj = state.getIn(['visitedHistoryPaths', pathKey]) && state.getIn(['visitedHistoryPaths', pathKey]).toJS();
    if (visitedObj) {
        state = state.deleteIn([visitedObj.objectName, visitedObj.objectId])
            .deleteIn(['visitedHistoryPaths', pathKey])
            .set('config', visitedObj.objectId === objectId ? fromJS(defaultState.config) : state.get('config'));
    }
    return state;
}
