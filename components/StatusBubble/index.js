import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import Text from '../Text';
import { uppercaseFirst } from '../../helpers';

import style from './style.css';

/**
 * There are two types of display modes:
 *
 * "filled":
 * Used on single pages where the main accent is the status.
 *
 * "bordered":
 * Used on lists, tables or wherever user can see more than one active status.
 * This display mode is preferred for screens where the status should not be the main eye catching element.
 */
class StatusBubble extends Component {
    constructor() {
        super();
        this.buildClassName = this.buildClassName.bind(this);
    }

    buildClassName() {
        const { mode, color } = this.props;
        const uppercasedColor = uppercaseFirst(color);
        const uppercasedMode = uppercaseFirst(mode);
        return `status${uppercasedColor}${uppercasedMode}`;
    }

    render() {
        const { statusText, externalStyles } = this.props;
        const statusClassName = this.buildClassName();
        return (
            <div className={classnames(style.statusBubble, style[statusClassName], externalStyles)}>
                <Text>{statusText}</Text>
            </div>
        );
    }
}

StatusBubble.propTypes = {
    statusText: PropTypes.string.isRequired,
    externalStyles: PropTypes.string,
    color: PropTypes.oneOf([
        'blue', 'green', 'orange', 'red', 'neutral'
    ]),
    mode: PropTypes.oneOf([
        'filled', 'outlined'
    ]).isRequired
};

StatusBubble.defaultProps = {
    mode: 'filled',
    color: 'neutral'
};

export default StatusBubble;
