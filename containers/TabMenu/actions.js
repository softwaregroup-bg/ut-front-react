import * as actionTypes from './actionTypes';

export function addTab(pathname, title, isMain) {
    return {
        type: actionTypes.ADD_TAB,
        pathname: pathname,
        isMain: isMain,
        title: title
    };
}

export function removeTab(pathname) {
    return {
        type: actionTypes.REMOVE_TAB,
        pathname: pathname
    };
}

export function updateTabTitle(pathname, newTitle) {
    return {
        type: actionTypes.UPDATE_TAB_TITLE,
        pathname: pathname,
        newTitle: newTitle
    };
}
