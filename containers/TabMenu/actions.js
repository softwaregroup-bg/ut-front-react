import * as actionTypes from './actionTypes';

export function addTab(pathname, title, isMain, pagename, onTabClose) {
    return {
        type: actionTypes.ADD_TAB,
        pathname: pathname,
        pagename: pagename,
        isMain: isMain,
        title: title,
        onTabClose: onTabClose
    };
}

export function removeTab(pathname, pagename) {
    return {
        type: actionTypes.REMOVE_TAB,
        pathname: pathname,
        pagename: pagename
    };
}

export function updateTabTitle(pathname, newTitle) {
    return {
        type: actionTypes.UPDATE_TAB_TITLE,
        pathname: pathname,
        newTitle: newTitle
    };
}
