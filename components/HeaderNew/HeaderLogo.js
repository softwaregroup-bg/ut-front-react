import React, { Component, PropTypes } from 'react';
import Link from './../Link';
import { breakOnSpaceChars } from './../../utils/helpers';
import { joinArrayWithBreakTags } from './../../utils/dom';
import styles from './styles.css';

export default class HeaderLogo extends Component {
    render() {
        const { replaceWithBrakes, className } = this.props;
        const text = replaceWithBrakes ? joinArrayWithBreakTags(breakOnSpaceChars(this.props.text)) : this.props.text;

        return (
            <span className={className}>
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
    replaceWithBrakes: PropTypes.bool,
    className: PropTypes.string
};

HeaderLogo.contextTypes = {
    mainUrl: PropTypes.string
};
