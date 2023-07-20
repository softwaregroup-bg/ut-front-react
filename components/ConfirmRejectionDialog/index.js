import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
        this.translate = this.translate.bind(this);
    }

    translate(text) {
        const lang = this.context.language || 'en';
        return typeof this.context.translate === 'function' ? this.context.translate(text, lang) : text;
    }

    onChange(e) {
        const rejectReasonValidators = getRejectReasonValidationRules();
        let canSubmit;
        const valid = rejectReasonValidator(e.value, rejectReasonValidators);
        if (valid.isValid) {
            canSubmit = true;
            this.props.updateErrors({}, this.props.id);
        } else {
            canSubmit = false;
            this.props.updateErrors(prepareErrors(valid.errors), this.props.id);
        }
        this.props.changeConfirmDialogValue({value: e.value, canSubmit});
    }

    renderContainer() {
        const rejectReasonValidators = getRejectReasonValidationRules();
        const {errors} = this.props;
        if (this.props.showInput) {
            return (
                <div>
                    <TextArea
                        type='text'
                        label={this.translate('Reason') + ':'}
                        onChange={this.onChange}
                        keyProp='rejectReason'
                        value={this.props.value}
                        isEdited={!!this.props.value}
                        validators={rejectReasonValidators}
                        isValid={!errors.get('rejectReason')}
                        errorMessage={this.translate(errors.get('rejectReason'))}
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
                label: this.translate(button.get('label')),
                href: button.get('href') || '',
                styleType: button.get('label').toLowerCase() !== 'cancel' ? 'primaryDialog' : 'secondaryDialog',
                disabled: button.has('disabled') ? !this.props.canSubmit : false,
                onClick: button.get('onClick')
            };
        }).toJS();
    }

    get title() {
        return capitalizeEveryWord(this.translate(this.props.title || 'Confirm Approval'));
    }

    render() {
        return (
            <Popup
                fullWidth={!!this.props.fullWidth}
                isOpen={this.props.isOpen}
                header={{ text: this.title, closeIcon: false }}
                footer={{ actionButtons: this.actionButtons }}
            >
                {this.props.children}
                {this.renderContainer()}
            </Popup>
        );
    }
}

ConfirmRejectionDialog.propTypes = {
    title: PropTypes.string,
    id: PropTypes.string,
    // contentStyle: PropTypes.object,
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

ConfirmRejectionDialog.contextTypes = {
    translate: PropTypes.func
};

export default ConfirmRejectionDialog;
