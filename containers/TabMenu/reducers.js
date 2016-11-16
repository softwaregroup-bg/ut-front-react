import * as actionTypes from './actionTypes';

export const tabMenu = (state = {tabs: [], usedPaths: {}, active: {}}, action) => {
    if (action.type === actionTypes.ADD_TAB) {
        let tab = {
            pathname: action.pathname,
            title: action.title,
            canClose: true,
            isMain: action.isMain
        };
        if (!state.usedPaths[action.pathname]) {
            state.tabs.push(tab);
            state.usedPaths[action.pathname] = true;
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
    return state;
};

export default {tabMenu};
