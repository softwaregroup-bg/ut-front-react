import * as actionTypes from './actionTypes';

export function addTab(pathname, title, isMain, pagename, shouldUpdate = false) {
    return {
        type: actionTypes.ADD_TAB,
        pathname,
        pagename,
        isMain,
        title,
        shouldUpdate
    };
}

export function removeTab(pathname, pagename) {
    return {
        type: actionTypes.REMOVE_TAB,
        pathname,
        pagename
    };
}

export function updateTabTitle(pathname, newTitle) {
    return {
        type: actionTypes.UPDATE_TAB_TITLE,
        pathname,
        newTitle
    };
}

export function closeAllTabs() {
    return {
        type: actionTypes.CLOSE_ALL_TABS
    };
}
