import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.css';

export default class HeaderLogo extends Component {
    render() {
        const { text } = this.props;
        return (
            <span className={classNames(styles.headerLogoContainer, styles.headerComponent)}>
                <span className={styles.headerLogo} />
                <span className={styles.headerTitle}>{text}</span>
            </span>
        );
    }
}

HeaderLogo.propTypes = {
    text: PropTypes.string
};
