import React, { Component } from 'react';
import StandardButton from '../StandardButton';
import actionButtonsStyles from './styles.css';

export default class actionButtons extends Component {
    constructor(props) {
        super(props);

        this.createActionButtons = this.createActionButtons.bind(this);
    }

    createActionButtons() {
        let { buttons } = this.props;

        return buttons.map(button => {
            return <StandardButton className={button.className} onClick={button.onClick}/>
        })
    }

    render() {
        return (
            <div className={actionButtonsStyles.actionButtonsContainer}>
                {this.createActionButtons()}
            </div>
        )
    }
}
