import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { Tab, MultiTab } from './../Tab';
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

    render() {
        const { tabset } = this.props;
        let tabs = [];
        tabset.map((tab, i) => {
            const isMulti = this.isMulti(tab);
            const hasPermission = this.isPermissionCheckRequired(tab)
              ? this.hasPermission(tab.permission)
              : true;

            hasPermission && tabs.push(
              (
                <div key={i}>
                  {isMulti ? <MultiTab tab={tab} /> : <Tab tab={tab} />}
                </div>
              )
          );
        });

        return (
            <span className={classNames(styles.headerComponent, styles.tabsContainer)}>
              {tabs}
            </span>
        );
    }
}

TabsContainer.propTypes = {
    tabset: PropTypes.array
};

TabsContainer.contextTypes = {
    checkPermission: PropTypes.func
};
