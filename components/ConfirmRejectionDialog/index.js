import React, { PropTypes, Component } from 'react';
import TextArea from '../Input/TextArea';
import Text from '../Text';
import Popup from '../Popup';
import { capitalizeEveryWord } from '../../utils/helpers';
import {getRejectReasonValidationRules, rejectReasonValidator, prepareErrors} from './helpers';

class ConfirmRejectionDialog extends Component {
    constructor(props, context) {
        super(props, context);
        this.renderContainer = this.renderContainer.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    onChange(e) {
        let rejectReasonValidators = getRejectReasonValidationRules();
        let canSubmit;
        let valid = rejectReasonValidator(e.value, rejectReasonValidators);
        if (valid.isValid) {
            canSubmit = true;
            this.props.updateErrors({}, this.props.id);
        } else {
            canSubmit = false;
            this.props.updateErrors(prepareErrors(valid.errors), this.props.id);
        }
        this.props.changeConfirmDialogValue({value: e.value, canSubmit: canSubmit});
    }
    renderContainer() {
        let rejectReasonValidators = getRejectReasonValidationRules();
        let {errors} = this.props;
        if (this.props.showInput) {
            return (
                <div>
                    <TextArea
                        type='text'
                        label='Reason:'
                        onChange={this.onChange}
                        keyProp='rejectReason'
                        value={this.props.value}
                        isEdited={!!this.props.value}
                        validators={rejectReasonValidators}
                        isValid={!errors.get('rejectReason')}
                        errorMessage={errors.get('rejectReason')}
                    />
                </div>
            );
        } else {
            return (<Text>{this.props.message}</Text>);
        }
    }
    get actionButtons() {
        const { buttons } = this.props;
        return buttons.map((button) => {
            return {
                label: button.get('label'),
                href: button.get('href') || '',
                styleType: button.get('label').toLowerCase() !== 'cancel' ? 'primaryDialog' : 'secondaryDialog',
                disabled: button.has('disabled') ? !this.props.canSubmit : false,
                onClick: button.get('onClick')
            };
        }).toJS();
    }
    get title() {
        return capitalizeEveryWord(this.props.title || 'Confirm Approval');
    }
    render() {
        return (
            <Popup
                fullWidth={!!this.props.fullWidth}
                isOpen={this.props.isOpen}
                header={{ text: this.title, closeIcon: false }}
                footer={{ actionButtons: this.actionButtons }} >
                {this.props.children}
                {this.renderContainer()}
            </Popup>
        );
    }
}

ConfirmRejectionDialog.propTypes = {
    title: PropTypes.string,
    id: PropTypes.string,
    contentStyle: PropTypes.object,
    showInput: PropTypes.bool,
    buttons: PropTypes.object.isRequired, // immutable list
    children: PropTypes.any,
    isOpen: PropTypes.bool,
    errors: PropTypes.object,
    updateErrors: PropTypes.func,
    changeConfirmDialogValue: PropTypes.func,
    message: PropTypes.string,
    canSubmit: PropTypes.bool,
    value: PropTypes.string,
    fullWidth: PropTypes.bool
};

export default ConfirmRejectionDialog;
