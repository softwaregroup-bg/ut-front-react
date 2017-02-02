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
                <StandardButton key={index}
                  type={button.type}
                  label={button.label}
                  className={button.className}
                  onClick={button.onClick} />
            );
        })}
    </div>
);

ActionButtons.propTypes = {
    buttons: PropTypes.array,
    className: PropTypes.string
};

export default ActionButtons;
