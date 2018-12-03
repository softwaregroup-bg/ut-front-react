import React, { PropTypes } from 'react';
import classnames from 'classnames';
import StandardButton from '../StandardButton';
import actionButtonsStyles from './styles.css';

const ActionButtons = ({
    buttons,
    className
}) => (
    <div className={classnames(actionButtonsStyles.actionButtonsContainer, className)}>
        {buttons.map((button, index) => {
            return (
                <StandardButton key={index} {...button} />
            );
        })}
    </div>
);

ActionButtons.propTypes = {
    buttons: PropTypes.array,
    className: PropTypes.string
};

ActionButtons.defaultProps = {
    buttons: []
};

export default ActionButtons;
