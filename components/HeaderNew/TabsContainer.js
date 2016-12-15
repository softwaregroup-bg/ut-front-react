import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Tab from './Tab';
import MultiTab from './MultiTab';
import styles from './styles.css';

export default class TabsContainer extends Component {
    isMulti(tab) {
        return !!tab.multi;
    }

    render() {
        const { tabset } = this.props;
        let tabs = tabset.map((tab, i) => {
            const isMulti = this.isMulti(tab);

            return (
                <div key={i}>{isMulti ? <MultiTab tab={tab} /> : <Tab tab={tab} />}</div>
            );
        });

        return (
            <span className={classNames(styles.headerComponent, styles.tabsContainer)}>{tabs}</span>
        );
    }
}

TabsContainer.propTypes = {
    tabset: PropTypes.array
};
