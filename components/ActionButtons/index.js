import React, { Component, PropTypes } from 'react';
import StandardButton from '../StandardButton';
import actionButtonsStyles from './styles.css';

export default class ActionButtons extends Component {
    createActionButtons() {
        let { buttons } = this.props;

        return buttons.map((button, index) => {
            return <StandardButton key={index} className={button.className} onClick={button.onClick} />;
        });
    }

    render() {
        return (
            <div className={actionButtonsStyles.actionButtonsContainer}>
                {this.createActionButtons()}
            </div>
        );
    }
}

ActionButtons.propTypes = {
    buttons: PropTypes.array
};
