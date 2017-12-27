import * as actionTypes from './actionTypes';

export const tabMenu = (state = {tabs: [], usedPaths: {}, active: {}}, action) => {
    if (action.type === actionTypes.ADD_TAB) {
        let tab = {
            pathname: action.pathname,
            pagename: action.pagename,
            title: action.title,
            canClose: true,
            isMain: action.isMain
        };

        if (!state.usedPaths[action.pathname]) {
            // Create new tab if this path is not already presented
            state.tabs.push(tab);
            state.usedPaths[action.pathname] = true;
        } else if (action.shouldUpdate) {
            // For already presented tabs with updated info (ex. tab title)
            let tabIndex = state.tabs.findIndex(tab => tab.pathname === action.pathname);
            state.tabs.splice(tabIndex, 1, tab);
        }

        return {
            tabs: state.tabs,
            active: tab,
            usedPaths: state.usedPaths
        };
    }
    if (action.type === actionTypes.REMOVE_TAB) {
        let tabsCount = state.tabs.length;
        let tab = null;
        let tabIndex = 0;
        for (tabIndex = 0; tabIndex < tabsCount; tabIndex++) {
            let currentTab = state.tabs[tabIndex];
            if (currentTab.pathname === action.pathname) {
                tab = currentTab;
                break;
            }
        }
        if (!tab || (state.tabs.length === 1 && state.tabs[0].isMain)) {
            return state;
        }
        let prev = state.tabs[tabIndex - 1];
        let next = state.tabs[tabIndex + 1];
        let active = next || prev;
        if (action.pathname !== state.active.pathname) {
            active = state.active;
        }
        return {
            active: active,
            tabs: state.tabs.filter((tab) => tab.pathname !== action.pathname),
            usedPaths: {
                ...state.usedPaths,
                [action.pathname]: false
            }
        };
    }
    if (action.type === actionTypes.UPDATE_TAB_TITLE) {
        for (let i = 0; i < state.tabs.length; i++) {
            if (action.pathname === state.tabs[i].pathname) {
                state.tabs[i].title = action.newTitle;
                break;
            }
        }
        return state;
    }
    return state;
};

export default {tabMenu};
