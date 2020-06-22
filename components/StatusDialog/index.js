import PropTypes from 'prop-types';
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

const StatusDialog = ({ status, onClose }) => {
    var actions = [];

    let isOpen = status.size > 0;
    let statusString = status.get('status');
    if (statusString !== 'pending') {
        actions.push(<Button label='Ok' onClick={onClose} />);
    }

    let upperCasedStatus = statusString ? statusString.toUpperCase() : '';
    let message = status.get('message');
    let displayMsg = [];
    if (upperCasedStatus) {
        displayMsg.push(upperCasedStatus);
    }
    if (message) {
        displayMsg.push(message);
    }

    return (
        <div>
            <Dialog actions={actions} modal open={isOpen}>
                <div dangerouslySetInnerHTML={{__html: displayMsg.join(' - ')}} />
            </Dialog>
        </div>
    );
};

StatusDialog.propTypes = {
    status: PropTypes.object.isRequired, // immutalbe object,
    onClose: PropTypes.func.isRequired
};

export default StatusDialog;
