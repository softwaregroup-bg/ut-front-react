import React, { PropTypes, Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { Container, Row, Col } from 'reactstrap';

import TextArea from '../Input/TextArea';
import Text from '../Text';

import { getRejectReasonValidationRules, rejectReasonValidator, prepareErrors } from './helpers';

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
                <Col xs='12'>
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
                </Col>
            );
        } else {
            return (<Col xs='12'><Text>{this.props.message}</Text></Col>);
        }
    }
    render() {
        let actions = this.props.buttons.map((btn, i) => {
            let disabled = btn.has('disabled') ? !this.props.canSubmit : false;
            return (
                <FlatButton
                  key={i}
                  label={btn.get('label')}
                  href={btn.get('href') || ''}
                  primary
                  disabled={disabled}
                  keyboardFocused={btn.get('keyboardFocused')}
                  onTouchTap={btn.get('onClick')}
                />
            );
        }
        );
        return (
            <Dialog
              title={this.props.title}
              open={this.props.isOpen}
              actions={actions}
              contentStyle={this.props.contentStyle}
              bodyStyle={{overflowY: 'auto'}} >
                <Container>
                    <Row>
                        {this.props.children}
                        {this.renderContainer()}
                    </Row>
                </Container>
            </Dialog>
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
    value: PropTypes.string
};

export default ConfirmRejectionDialog;
