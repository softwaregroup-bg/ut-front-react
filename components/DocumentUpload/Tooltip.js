import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.css';

const Tooltip = ({
    className,
    tooltipText
}) => {
    return (
        <div className={classnames(styles.tooltipContainer, className)}>
            <div className={styles.tooltip}>
                <span className={styles.tooltipText}>{tooltipText}</span>
                <div className={styles.tooltipHandle} />
            </div>
        </div>
    );
};

Tooltip.propTypes = {
    className: PropTypes.string,
    tooltipText: PropTypes.string
};

export default Tooltip;
