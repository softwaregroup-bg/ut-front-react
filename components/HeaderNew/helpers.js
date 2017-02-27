import { List } from 'immutable';
import { checkPermission } from '../../containers/Gate/helpers';

export function permissionPreCheck(tabList) {
    let validated = tabList.reduce((tabs, currentTab) => {
        let hasPermission = true;
        if (currentTab.get('permission')) {
            currentTab.get('permission').forEach(p => {
                hasPermission = hasPermission && checkPermission(p);
            });
        }
        if (hasPermission) {
            if (currentTab.get('multi')) {
                let validatedTab = permissionPreCheck(currentTab.get('multi'));
                if (!validatedTab.equals(currentTab.get('multi'))) {
                    if (validatedTab.size) {
                        currentTab.set('multi', validatedTab);
                    } else {
                        currentTab = null;
                    }
                }
            }
            if (currentTab) {
                tabs = tabs.push(currentTab);
            }
        }

        return tabs;
    }, List());

    return validated;
};
