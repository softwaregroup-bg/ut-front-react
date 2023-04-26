import * as actionTypes from './actionTypes';

export const tabMenu = (state = {tabs: [], usedPaths: {}, active: {}}, action) => {
    if (action.type === actionTypes.ADD_TAB) {
        const tab = {
            pathname: action.pathname,
            pagename: action.pagename,
            title: action.title,
            canClose: true,
            isMain: action.isMain
        };

        if (!state.usedPaths[action.pathname]) {
            /**
             * HOT FIX:
             * Receive notAddTab param to check strange behaviour because when triggering remove tab custom component
             * It calls after that add tab and it generates a empty tab that should be removed from the screen.
             */
            if (action.notAddTab) {
                return {
                    tabs: state.tabs,
                    active: state.tabs[0] || tab,
                    usedPaths: {
                        ...state.usedPaths,
                        [action.pathname]: false
                    }
                };
            }
            // Create new tab if this path is not already presented
            return {
                tabs: state.tabs.concat(tab),
                active: tab,
                usedPaths: {
                    ...state.usedPaths,
                    [action.pathname]: true
                }
            };
        } else if (action.shouldUpdate) {
            // For already presented tabs with updated info (ex. tab title)
            return {
                tabs: state.tabs.map(t => t.pathname === tab.pathname ? tab : t),
                active: tab,
                usedPaths: state.usedPaths
            };
        }

        return {
            tabs: state.tabs,
            active: tab,
            usedPaths: state.usedPaths
        };
    }
    if (action.type === actionTypes.REMOVE_TAB) {
        const tabsCount = state.tabs.length;
        let tab = null;
        let tabIndex = 0;
        for (tabIndex = 0; tabIndex < tabsCount; tabIndex++) {
            const currentTab = state.tabs[tabIndex];
            if (currentTab.pathname === action.pathname) {
                tab = currentTab;
                break;
            }
        }
        if (!tab || (state.tabs.length === 1 && state.tabs[0].isMain)) {
            return state;
        }
        let active;
        if (action.pathname !== state.active.pathname) {
            active = state.active;
        } else {
            const prev = state.tabs[tabIndex - 1];
            const next = state.tabs[tabIndex + 1];
            active = next || prev;
            if (active && action.history) {
                action.history && action.history.push(active.pathname);
            } else {
                action.history && action.history.push('/');
            }
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
        state.tabs = state.tabs.map(t => t.pathname === action.pathname ? Object.assign({}, t, {title: action.newTitle}) : t);
        return state;
    }
    if (action.type === actionTypes.CLOSE_ALL_TABS) {
        return {
            active: state.active,
            tabs: [],
            usedPaths: {}
        };
    }
    return state;
};

export default {tabMenu};
