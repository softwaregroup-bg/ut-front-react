/* eslint-disable react/no-unknown-property */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class StatusDialog extends Component {
    constructor(props, context) {
        super(props, context);
        this.translate = this.translate.bind(this);
    }

    translate(text) {
        return typeof this.context.translate === 'function' ? this.context.translate(text) : text;
    }

    render() {
        const { status, onClose } = this.props;
        const actions = [];
        const isOpen = status.size > 0;
        const statusString = status.get('status');
        if (statusString !== 'pending') {
            actions.push(<FlatButton label='Ok' onTouchTap={onClose} />);
        }

        const upperCasedStatus = statusString ? statusString.toUpperCase() : '';
        let message = status.get('message');
        message = message && message.message ? message.message : message;

        if (message && message.includes('portJsonRPC.generic: ')) {
            message = message.substring(21);
        }
        const displayMsg = [];
        if (upperCasedStatus) {
            displayMsg.push(upperCasedStatus);
        }
        if (message) {
            displayMsg.push(message);
        }

        return (
            <div>
                <Dialog actions={actions} modal open={isOpen} style={{minHeight: '300px'}}>
                    {upperCasedStatus && <div dangerouslySetInnerHTML={{__html: this.translate(upperCasedStatus)}} />}
                    {message && <div dangerouslySetInnerHTML={{__html: this.translate(message)}} />}
                    {/* <div dangerouslySetInnerHTML={{__html: displayMsg.join(' - ')}} /> */}
                </Dialog>
            </div>
        );
    }
}

StatusDialog.contextTypes = {
    translate: PropTypes.func
};

StatusDialog.defaultProps = {
    status: 'pending'
};

StatusDialog.propTypes = {
    status: PropTypes.object,
    onClose: PropTypes.func.isRequired
};
