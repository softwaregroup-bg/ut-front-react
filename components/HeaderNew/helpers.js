import { List } from 'immutable';
import { checkPermission } from '../../containers/Gate/helpers';

// filters tabs we have no permission for as well as empty multitabs
export function permissionPreCheck(tabList) {
    let r = tabList.reduce((tabs, currentTab) => {
        let hasPermission = true;
        currentTab.get('permission') && currentTab.get('permission').forEach(p => {
            hasPermission = hasPermission && checkPermission(p);
        });

        if (hasPermission) {
            if (currentTab.get('multi')) {
                let validChildren = permissionPreCheck(currentTab.get('multi'));
                if (!validChildren.equals(currentTab.get('multi'))) {
                    if (validChildren.size) {
                        currentTab = currentTab.set('multi', validChildren);
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

    return r;
};
