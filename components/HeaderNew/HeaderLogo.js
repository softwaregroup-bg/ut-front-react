import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Link from './../Link';
import styles from './styles.css';

export default class HeaderLogo extends Component {
    render() {
        const { text } = this.props;

        return (
            <span className={classNames(styles.headerLogoContainer, styles.headerComponent)}>
                <Link
                  to={this.context.mainUrl}
                  useRawTo >
                    <span className={styles.headerLogo} />
                </Link>
                <span className={styles.headerTitle}>{text}</span>
            </span>
        );
    }
}

HeaderLogo.propTypes = {
    text: PropTypes.string
};

HeaderLogo.contextTypes = {
    mainUrl: PropTypes.string
};
