import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './styles.css';

export default class TabsContainer extends Component {
    render() {
        return (
            <span className={classNames(styles.headerComponent, styles.tabsContainer)}>tabs</span>
        );
    }
}
