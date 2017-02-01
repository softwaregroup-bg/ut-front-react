import React, { Component, PropTypes } from 'react';
import StandardButton from '../StandardButton';
import actionButtonsStyles from './styles.css';

const ActionButtons = ({
    buttons
}) => (
    <div className={actionButtonsStyles.actionButtonsContainer}>
        {buttons.map((button, index) => {
            return (
                <StandardButton key={index}
                type={button.type}
                label={button.label}
                className={button.className}
                onClick={button.onClick} />
            )
        })}
    </div>
);

ActionButtons.propTypes = {
    buttons: PropTypes.array
};

export default ActionButtons;
