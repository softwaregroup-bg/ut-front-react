import * as actionTypes from './actionTypes';
import { dateValidations } from './helpers';

export function checkHistories(histories, checked) {
    return {
        type: actionTypes.CHECK_HISTORIES,
        params: {
            histories,
            checked
        }
    };
}
export function selectHistory(history, isSelected) {
    return {
        type: actionTypes.SELECT_HISTORY,
        params: {
            history,
            isSelected
        }
    };
};
export const changeFilter = (params) => ({
    type: actionTypes.CHANGE_HISTORY_FILTER,
    params
});
export function changeHistoryProfile(objectId, objectName) {
    return {
        type: actionTypes.CHANGE_HISTORY_PROFILE,
        params: {
            objectId,
            objectName
        }
    };
};
// export const setField = (record) => ({
//     type: actionTypes.SET_HISTORY_FIELD,
//     params: record
// });
export const toggleFilter = () => ({
    type: actionTypes.TOGGLE_HISTORY_FILTER
});
export const refetchAuditLogs = () => ({
    type: actionTypes.REFETCH_HISTORIES
});
export function clearFilters() {
    return {
        type: actionTypes.CLEAR_HISTORY_FILTER
    };
}
export function updateGridPagination(params) {
    return {
        type: actionTypes.UPDATE_HISTORY_GRID_PAGINATION,
        params: params
    };
}
export function changeSortFilter(column, direction) {
    return {
        type: actionTypes.CHANGE_HISTORY_GRID_SORTORDER,
        params: {column, direction}
    };
}

export function fetchHistories(params) {
    let result = dateValidations(params);
    if (result.key === 'error') {
        return updateFilterErrors({key: result.key, value: result.value});
    } else {
        return {
            type: actionTypes.FETCH_HISTORIES,
            method: `history.${params.objectName}.listChanges`,
            params: {
                ...params
            }
        };
    }
}

export function updateFilterErrors(params) {
    return {
        type: actionTypes.UPDATE_FILTER_ERRORS,
        params
    };
}

export function getEventDetails(params) {
    return {
        type: actionTypes.GET_EVENT_DETAILS,
        method: 'externalAudit.audit.getByGlobalId',
        params
    };
}
