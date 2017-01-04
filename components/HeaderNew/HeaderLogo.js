import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Link from './../Link';
import { breakOnSpaceChars } from './../../utils/helpers';
import { joinArrayWithBreakTags } from './../../utils/dom';
import styles from './styles.css';

export default class HeaderLogo extends Component {
    render() {
        const { replaceWithBrakes } = this.props;
        const text = replaceWithBrakes ? joinArrayWithBreakTags(breakOnSpaceChars(this.props.text)) : this.props.text;

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
    text: PropTypes.string,
    replaceWithBrakes: PropTypes.bool
};

HeaderLogo.contextTypes = {
    mainUrl: PropTypes.string
};
