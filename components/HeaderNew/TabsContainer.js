import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tab, MultiTab } from './../Tab';
import { permissionPreCheck } from './helpers';
import { fromJS } from 'immutable';

import styles from './styles.css';

export default class TabsContainer extends Component {
    hasPermission(permissions) {
        return permissions.every((permission) => {
            return permission.indexOf('!') === 0
                ? !this.context.checkPermission(permission.substr(1))
                : this.context.checkPermission(permission);
        });
    }

    isPermissionCheckRequired(tab) {
        return tab.permission !== undefined;
    }

    isMulti(tab) {
        return !!tab.multi;
    }

    getTabComponents(tabset) {
        tabset = permissionPreCheck(fromJS(tabset)).toJS();

        return tabset.reduce((memo, tab, i) => {
            const isMulti = this.isMulti(tab);

            memo.push(
                <div key={i} className={styles.tabContainer}>
                    {isMulti ? <MultiTab tab={tab} /> : <Tab tab={tab} />}
                </div>
            );

            return memo;
        }, []);
    }

    render() {
        const { tabset, className } = this.props;
        const tabs = this.getTabComponents(tabset);

        return (
            <span className={className}>
                {tabs}
            </span>
        );
    }
}

TabsContainer.propTypes = {
    tabset: PropTypes.array,
    className: PropTypes.string
};

TabsContainer.contextTypes = {
    checkPermission: PropTypes.func
};
